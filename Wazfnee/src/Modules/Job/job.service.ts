import { Types } from 'mongoose';
import { CompanyModel } from '../../DB/Models/company.model';
import { JobModel } from '../../DB/Models/job.model';
import { CompanyRepository } from '../../DB/repositories/company.repository';
import { JobRepository } from '../../DB/repositories/job.repository';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '../../Utils/response/error.response';
import {
  AddJobDTO,
  FilterJobsDTO,
  GetJobApplicationsDTO,
  GetJobsQueryDTO,
  UpdateJobDTO,
} from './job.dto';
import { ApplicationRepository } from '../../DB/repositories/application.repository';
import { ApplicationModel } from '../../DB/Models/application.model';
import { ApplicationStatus } from '../../Utils/enums/application.enum';
import { emitNewApplication, emitToUser } from '../../Utils/socket/socket.events';

export class JobService {
  private readonly _jobRepo = new JobRepository(JobModel);
  private readonly _companyRepo = new CompanyRepository(CompanyModel);
  private readonly _applicationRepo = new ApplicationRepository(ApplicationModel);

  addJob = async (userId: string, data: AddJobDTO) => {
    const company = await this._companyRepo.findById({
      id: data.companyId,
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.deletedAt) {
      throw new BadRequestException('Company has been deleted');
    }

    if (company.bannedAt) {
      throw new BadRequestException('Company has been banned');
    }

    const isOwner = company.createdBy.toString() === userId;

    const isHR = company.hrs.some((hrId) => hrId.toString() === userId);

    const jobs = await this._jobRepo.create({
      data: [
        {
          ...data,
          addedBy: new Types.ObjectId(userId),
          companyId: company._id,
          closed: false,
        },
      ],
    });

    const job = jobs?.[0];

    if (!job) {
      throw new BadRequestException('Failed to create job');
    }

    return job;
  };

  updateJob = async (userId: string, jobId: string, data: UpdateJobDTO) => {
    const job = await this._jobRepo.findById({
      id: jobId,
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.closed) {
      throw new BadRequestException('Cannot update a closed job');
    }

    const company = await this._companyRepo.findById({
      id: job.companyId.toString(),
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.deletedAt) {
      throw new BadRequestException('Company has been deleted');
    }

    if (company.bannedAt) {
      throw new BadRequestException('Company has been banned');
    }

    if (company.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only the company owner can update the job');
    }

    const updatedJob = await this._jobRepo.findByIdAndUpdate({
      id: jobId,
      update: {
        $set: {
          ...data,
          updatedBy: new Types.ObjectId(userId),
        },
      },
    });

    if (!updatedJob) {
      throw new NotFoundException('Job not found');
    }

    return updatedJob;
  };

  deleteJob = async (userId: string, jobId: string): Promise<{ jobId: string }> => {
    const job = await this._jobRepo.findById({
      id: jobId,
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const company = await this._companyRepo.findById({
      id: job.companyId.toString(),
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.deletedAt) {
      throw new BadRequestException('Company has been deleted');
    }

    if (company.bannedAt) {
      throw new BadRequestException('Company has been banned');
    }

    const isCompanyHR = company.hrs.some((hrId) => hrId.toString() === userId);

    if (!isCompanyHR) {
      throw new ForbiddenException('Only an HR of this company can delete the job');
    }

    await this._jobRepo.deleteOne({
      filter: {
        _id: jobId,
      },
    });

    return {
      jobId,
    };
  };

  getJobs = async (companyId: string, jobId?: string, query?: GetJobsQueryDTO) => {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    const sort = query?.sort ?? '-createdAt';

    let targetCompanyId = companyId;

    if (query?.companyName) {
      const company = await this._companyRepo.findOne({
        filter: {
          companyName: {
            $regex: query.companyName.trim(),
            $options: 'i',
          },
        },
        select: '_id',
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      if (company._id.toString() !== companyId) {
        throw new BadRequestException('Company name does not match company ID');
      }

      targetCompanyId = company._id.toString();
    }

    if (jobId) {
      const job = await this._jobRepo.findOne({
        filter: {
          _id: jobId,
          companyId: targetCompanyId,
        },
        select:
          'jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills addedBy updatedBy closed companyId createdAt updatedAt',
      });

      if (!job) {
        throw new NotFoundException('Job not found');
      }

      return {
        jobs: [job],
        pagination: {
          page: 1,
          limit: 1,
          total: 1,
          totalPages: 1,
        },
      };
    }

    const filter = {
      companyId: targetCompanyId,
    };

    const [jobs, total] = await Promise.all([
      this._jobRepo.find({
        filter,
        select:
          'jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills addedBy updatedBy closed companyId createdAt updatedAt',
        options: {
          skip,
          limit,
        },
      }),

      this._jobRepo.countDocuments({
        filter,
      }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  filterJobs = async (query: FilterJobsDTO) => {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const sort = query.sort ?? '-createdAt';

    const filter: Record<string, unknown> = {
      closed: false,
    };
    if (query.workingTime) {
      filter['workingTime'] = query.workingTime;
    }

    if (query.jobLocation) {
      filter['jobLocation'] = query.jobLocation;
    }

    if (query.seniorityLevel) {
      filter['seniorityLevel'] = query.seniorityLevel;
    }

    if (query.jobTitle) {
      filter['jobTitle'] = {
        $regex: query.jobTitle.trim(),
        $options: 'i',
      };
    }

    if (query.technicalSkills) {
      const skills = query.technicalSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      if (skills.length > 0) {
        filter['technicalSkills'] = {
          $all: skills,
        };
      }
    }

    const [jobs, total] = await Promise.all([
      this._jobRepo.find({
        filter,
        select:
          'jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills addedBy updatedBy closed companyId createdAt updatedAt',
        options: {
          skip,
          limit,
          sort,
        },
      }),

      this._jobRepo.countDocuments({
        filter,
      }),
    ]);

    return {
      jobs,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  getJobApplications = async (userId: string, jobId: string, query: GetJobApplicationsDTO) => {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const sort = query.sort ?? '-createdAt';

    const job = await this._jobRepo.findById({
      id: jobId,
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const company = await this._companyRepo.findById({
      id: job.companyId.toString(),
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const isOwner = company.createdBy.toString() === userId;

    const isHR = company.hrs.some((hrId) => hrId.toString() === userId);

    if (!isOwner && !isHR) {
      throw new ForbiddenException('Only the company owner or HR can view applications');
    }

    const total = await this._applicationRepo.countDocuments({
      filter: {
        jobId: new Types.ObjectId(jobId),
      },
    });

    const populatedJob = await this._jobRepo.findById({
      id: jobId,
      options: {
        populate: [
          {
            path: 'applications',
            options: {
              skip,
              limit,
              sort,
            },
            populate: {
              path: 'userId',
              select: 'firstName lastName email gender dob profilePic',
            },
          },
        ],
      },
    });

    if (!populatedJob) {
      throw new NotFoundException('Job not found');
    }

    const populatedApplications = (populatedJob as any).applications ?? [];

    const applications = populatedApplications.map((application: any) => {
      const { userId, ...applicationData } = application.toObject();

      return {
        ...applicationData,
        user: userId,
      };
    });

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  applyToJob = async (userId: string, jobId: string, file: Express.Multer.File) => {
    if (!file) {
      throw new BadRequestException('CV file is required');
    }

    const job = await this._jobRepo.findById({
      id: jobId,
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.closed) {
      throw new BadRequestException('This job is closed and no longer accepting applications');
    }

    const company = await this._companyRepo.findById({
      id: job.companyId.toString(),
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }
    if (company.deletedAt) {
      throw new BadRequestException('Company has been deleted');
    }

    if (company.bannedAt) {
      throw new BadRequestException('Company has been banned');
    }

    if (!company.approvedByAdmin) {
      throw new BadRequestException('Company has not been approved by admin');
    }

    const existingApplication = await this._applicationRepo.findOne({
      filter: {
        jobId: new Types.ObjectId(jobId),
        userId: new Types.ObjectId(userId),
      },
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied to this job');
    }

    const applications = await this._applicationRepo.create({
      data: [
        {
          jobId: job._id,
          userId: new Types.ObjectId(userId),
          userCV: {
            secure_url: `/uploads/application/cv/${userId}/${file.filename}`,
            public_id: file.filename,
          },
          status: ApplicationStatus.PENDING,
        },
      ],
    });

    const application = applications?.[0];

    if (!application) {
      throw new BadRequestException('Failed to create job application');
    }

    const notification = {
      applicationId: application._id.toString(),
      jobId: job._id.toString(),
      companyId: company._id.toString(),
      applicantId: userId,
      jobTitle: job.jobTitle,
      message: `A new application has been submitted for ${job.jobTitle}`,
    };

    for (const hrId of company.hrs) {
      emitNewApplication(hrId.toString(), notification);
    }

    return application;
  };
}
