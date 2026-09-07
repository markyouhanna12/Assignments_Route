import { Types } from 'mongoose';
import { CompanyModel } from '../../DB/Models/company.model';
import { JobModel } from '../../DB/Models/job.model';
import { CompanyRepository } from '../../DB/repositories/company.repository';
import { JobRepository } from '../../DB/repositories/job.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '../../Utils/response/error.response';
import { AddJobDTO, UpdateJobDTO } from './job.dto';

export class JobService {
  private readonly _jobRepo = new JobRepository(JobModel);
  private readonly _companyRepo = new CompanyRepository(CompanyModel);

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
}
