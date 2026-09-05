import { Types } from 'mongoose';
import { CompanyModel } from '../../DB/Models/company.model';
import { CompanyRepository } from '../../DB/repositories/company.repository';
import { BadRequestException, ConflictException } from '../../Utils/response/error.response';
import { AddCompanyDTO } from './company.dto';

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
}
