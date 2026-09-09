import { Types } from 'mongoose';
import { CompanyModel } from '../../DB/Models/company.model';
import { CompanyRepository } from '../../DB/repositories/company.repository';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '../../Utils/response/error.response';
import { AddCompanyDTO, UpdateCompanyDTO } from './company.dto';
import { Role } from '../../Utils/enums/role.enum';
import { deleteLocalFile } from '../../Utils/multer/local-file.utils';
import { UserRepository } from '../../DB/repositories/user.repository';
import { UserModel } from '../../DB/Models/user.model';
import { ApplicationRepository } from '../../DB/repositories/application.repository';
import { ApplicationModel } from '../../DB/Models/application.model';
import { JobRepository } from '../../DB/repositories/job.repository';
import { JobModel } from '../../DB/Models/job.model';
import ExcelJS from 'exceljs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

export class CompanyService {
  private readonly _companyRepo = new CompanyRepository(CompanyModel);
  private readonly _userRepo = new UserRepository(UserModel);
  private readonly _applicationRepo = new ApplicationRepository(ApplicationModel);
  private readonly _jobRepo = new JobRepository(JobModel);

  addCompany = async (userId: string, data: AddCompanyDTO) => {
    const { companyName, companyEmail } = data;

    const existingCompany = await this._companyRepo.findOne({
      filter: {
        $or: [
          {
            companyName: companyName.trim(),
          },
          {
            companyEmail: companyEmail.trim().toLowerCase(),
          },
        ],
      },
    });

    if (existingCompany) {
      if (existingCompany.companyName.toLowerCase() === companyName.trim().toLowerCase()) {
        throw new ConflictException('Company name already exists');
      }
      if (existingCompany.companyEmail.toLowerCase() === companyEmail.trim().toLowerCase()) {
        throw new ConflictException('Company email already exists');
      }
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const companies = await this._companyRepo.create({
      data: [
        {
          ...data,
          companyName: companyName.trim(),
          companyEmail: companyEmail.trim().toLowerCase(),
          createdBy: new Types.ObjectId(userId),
          hrs: [],
          approvedByAdmin: false,
        },
      ],
    });

    const company = companies?.[0];

    if (!company) {
      throw new BadRequestException('Failed to create company');
    }

    return company;
  };

  updateCompany = async (userId: string, companyId: string, data: UpdateCompanyDTO) => {
    const company = await this._companyRepo.findById({ id: companyId });
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
      throw new ForbiddenException('Only the company owner can update the company');
    }

    if (data.companyName !== undefined) {
      const companyName = data.companyName.trim();

      if (companyName.toLowerCase() !== company.companyName.toLowerCase()) {
        const existingCompany = await this._companyRepo.findOne({
          filter: {
            companyName,
            _id: {
              $ne: companyId,
            },
          },
        });

        if (existingCompany) {
          throw new ConflictException('Company name already exists');
        }
      }
    }

    if (data.companyEmail !== undefined) {
      const companyEmail = data.companyEmail.trim().toLowerCase();

      if (companyEmail !== company.companyEmail.toLowerCase()) {
        const existingCompany = await this._companyRepo.findOne({
          filter: {
            companyEmail,
            _id: {
              $ne: companyId,
            },
          },
        });

        if (existingCompany) {
          throw new ConflictException('Company email already exists');
        }
      }
    }

    const updateData: Partial<UpdateCompanyDTO> = {
      ...data,
    };

    if (updateData.companyName !== undefined) {
      updateData.companyName = updateData.companyName.trim();
    }

    if (updateData.companyEmail !== undefined) {
      updateData.companyEmail = updateData.companyEmail.trim().toLowerCase();
    }

    const updatedCompany = await this._companyRepo.findByIdAndUpdate({
      id: companyId,
      update: {
        $set: updateData,
      },
    });

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return updatedCompany;
  };

  softDeleteCompany = async (
    companyId: string,
    userId: string,
    userRole: Role,
  ): Promise<{ deletedAt: Date }> => {
    const company = await this._companyRepo.findById({
      id: companyId,
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.deletedAt) {
      throw new BadRequestException('Company is already deleted');
    }

    const isAdmin = userRole === Role.ADMIN;

    const isOwner = company.createdBy.toString() === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Only the company owner or admin can delete the company');
    }

    const deletedAt = new Date();

    const deletedCompany = await this._companyRepo.findByIdAndUpdate({
      id: companyId,
      update: {
        $set: {
          deletedAt,
        },
      },
    });
    if (!deletedCompany) {
      throw new NotFoundException('Company not found');
    }

    return {
      deletedAt,
    };
  };

  searchCompany = async (name: string) => {
    const searchName = name.trim();

    const companies = await this._companyRepo.find({
      filter: {
        companyName: {
          $regex: searchName,
          $options: 'i',
        },
        deletedAt: {
          $exists: false,
        },
      },
      select:
        'companyName description industry address numberOfEmployees companyEmail logo coverPic approvedByAdmin createdBy',
    });

    return companies;
  };

  uploadCompanyLogo = async (userId: string, companyId: string, file: Express.Multer.File) => {
    const company = await this._companyRepo.findById({
      id: companyId,
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
      throw new ForbiddenException('Only the company owner can upload the company logo');
    }

    if (company.logo?.secure_url) {
      await deleteLocalFile(company.logo.secure_url);
    }

    company.logo = {
      secure_url: `/uploads/company/logo/${companyId}/${file.filename}`,
      public_id: file.filename,
    };

    await company.save();

    return company.logo;
  };

  uploadCompanyCoverPic = async (userId: string, companyId: string, file: Express.Multer.File) => {
    const company = await this._companyRepo.findById({
      id: companyId,
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
      throw new ForbiddenException('Only the company owner can upload the company cover picture');
    }

    // Delete old cover picture if it exists
    if (company.coverPic?.secure_url) {
      await deleteLocalFile(company.coverPic.secure_url);
    }

    company.coverPic = {
      secure_url: `/uploads/company/cover/${companyId}/${file.filename}`,
      public_id: file.filename,
    };

    await company.save();

    return company.coverPic;
  };

  deleteCompanyLogo = async (userId: string, companyId: string): Promise<{ logo: null }> => {
    const company = await this._companyRepo.findById({
      id: companyId,
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
      throw new ForbiddenException('Only the company owner can delete the company logo');
    }

    if (!company.logo?.secure_url) {
      throw new BadRequestException('Company does not have a logo');
    }

    await deleteLocalFile(company.logo.secure_url);

    await company.updateOne({
      $unset: {
        logo: 1,
      },
    });

    return {
      logo: null,
    };
  };

  deleteCompanyCoverPic = async (
    userId: string,
    companyId: string,
  ): Promise<{ coverPic: null }> => {
    const company = await this._companyRepo.findById({
      id: companyId,
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

    if (!company.coverPic?.secure_url) {
      throw new BadRequestException('Company does not have a cover picture');
    }

    if (company.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only the company owner can delete the company cover picture');
    }

    // Delete physical file
    await deleteLocalFile(company.coverPic.secure_url);

    // Remove coverPic from MongoDB
    await company.updateOne({
      $unset: {
        coverPic: 1,
      },
    });

    return {
      coverPic: null,
    };
  };

  addCompanyHR = async (userId: string, companyId: string, hrUserId: string) => {
    const company = await this._companyRepo.findById({
      id: companyId,
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
      throw new ForbiddenException('Only the company owner can add HRs');
    }

    const hrUser = await this._userRepo.findById({
      id: hrUserId,
    });

    if (!hrUser) {
      throw new NotFoundException('HR user not found');
    }

    if (hrUser.deletedAt) {
      throw new BadRequestException('Cannot add a deleted user as HR');
    }

    if (hrUser.bannedAt) {
      throw new BadRequestException('Cannot add a banned user as HR');
    }

    if (!hrUser.isConfirmed) {
      throw new BadRequestException('Cannot add an unconfirmed user as HR');
    }

    // Company owner should not be added as HR.
    if (company.createdBy.toString() === hrUser._id.toString()) {
      throw new BadRequestException('Company owner cannot be assigned as HR');
    }

    const alreadyHR = company.hrs.some((hrId) => hrId.toString() === hrUser._id.toString());

    if (alreadyHR) {
      throw new ConflictException('User is already an HR for this company');
    }

    const updatedCompany = await this._companyRepo.findByIdAndUpdate({
      id: companyId,
      update: {
        $addToSet: {
          hrs: hrUser._id,
        },
      },
    });

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return hrUser;
  };

  exportApplications = async ({
    companyId,
    userId,
    date,
  }: {
    companyId: string;
    userId: string;
    date: string;
  }) => {
    const company = await this._companyRepo.findById({
      id: companyId,
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

    if (!isOwner && !isHR) {
      throw new ForbiddenException('Only the company owner or HR can export applications');
    }
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const jobs = await this._jobRepo.find({
      filter: {
        companyId: company._id,
      },
      select: '_id jobTitle',
    });

    if (!jobs.length) {
      throw new NotFoundException('No jobs found for this company');
    }

    const jobIds = jobs.map((job) => job._id);

    const applications = await this._applicationRepo.find({
      filter: {
        jobId: {
          $in: jobIds,
        },
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
      options: {
        populate: [
          {
            path: 'userId',
            select: 'firstName lastName email',
          },
          {
            path: 'jobId',
            select: 'jobTitle',
          },
        ],
        sort: '-createdAt',
      },
    });

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Applications');

    worksheet.columns = [
      {
        header: 'Application ID',
        key: 'applicationId',
        width: 28,
      },
      {
        header: 'Applicant Name',
        key: 'applicantName',
        width: 28,
      },
      {
        header: 'Applicant Email',
        key: 'applicantEmail',
        width: 35,
      },
      {
        header: 'Job Title',
        key: 'jobTitle',
        width: 35,
      },
      {
        header: 'Status',
        key: 'status',
        width: 20,
      },
      {
        header: 'Applied At',
        key: 'appliedAt',
        width: 22,
      },
      {
        header: 'CV',
        key: 'cv',
        width: 55,
      },
    ];
    for (const application of applications) {
      const applicant = application.userId as any;
      const job = application.jobId as any;

      worksheet.addRow({
        applicationId: application._id.toString(),

        applicantName: `${applicant?.firstName ?? ''} ${applicant?.lastName ?? ''}`.trim(),

        applicantEmail: applicant?.email ?? '',

        jobTitle: job?.jobTitle ?? '',

        status: application.status,

        appliedAt: application.createdAt,

        cv: application.userCV?.secure_url ?? '',
      });
    }
    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    headerRow.height = 24;

    worksheet.getColumn('appliedAt').numFmt = 'yyyy-mm-dd hh:mm:ss';

    worksheet.autoFilter = {
      from: 'A1',
      to: 'G1',
    };

    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
      },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    const filename = `${company.companyName}-applications-${date}.xlsx`;

    // Save a copy on the server
    const downloadDirectory = path.join(process.cwd(), 'downloads', 'excels');

    await mkdir(downloadDirectory, {
      recursive: true,
    });

    const filePath = path.join(downloadDirectory, filename);

    await workbook.xlsx.writeFile(filePath);

    return {
      buffer,
      filename,
    };
  };
}
