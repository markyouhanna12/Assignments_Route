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

export class CompanyService {
  private readonly _companyRepo = new CompanyRepository(CompanyModel);

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
}
