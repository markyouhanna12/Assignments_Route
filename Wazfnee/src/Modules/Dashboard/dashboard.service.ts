import { CompanyModel } from '../../DB/Models/company.model';
import { UserModel } from '../../DB/Models/user.model';
import { CompanyRepository } from '../../DB/repositories/company.repository';
import { UserRepository } from '../../DB/repositories/user.repository';
import { BadRequestException, NotFoundException } from '../../Utils/response/error.response';

export class DashboardService {
  private readonly _companyRepo = new CompanyRepository(CompanyModel);
  private readonly _userRepo = new UserRepository(UserModel);

  getDashboardData = async () => {
    const [users, companies] = await Promise.all([
      this._userRepo.find({
        select: 'firstName lastName email provider role isConfirmed deletedAt bannedAt',
      }),
      this._companyRepo.find({
        select:
          'companyName description industry address numberOfEmployees companyEmail approvedByAdmin deletedAt bannedAt',
      }),
    ]);

    return {
      users,
      companies,
    };
  };

  toggleUserBan = async (userId: string) => {
    const user = await this._userRepo.findById({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.deletedAt) {
      throw new BadRequestException('Cannot ban a deleted user');
    }

    if (user.bannedAt) {
      const updatedUser = await this._userRepo.findByIdAndUpdate({
        id: userId,
        update: {
          $unset: {
            bannedAt: 1,
          },
        },
      });

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    }

    const updatedUser = await this._userRepo.findByIdAndUpdate({
      id: userId,
      update: {
        $set: {
          bannedAt: new Date(),
        },
      },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  };

  toggleCompanyBan = async (companyId: string) => {
    const company = await this._companyRepo.findById({
      id: companyId,
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.deletedAt) {
      throw new BadRequestException('Cannot ban a deleted company');
    }

    if (company.bannedAt) {
      const updatedCompany = await this._companyRepo.findByIdAndUpdate({
        id: companyId,
        update: {
          $unset: {
            bannedAt: 1,
          },
        },
      });

      if (!updatedCompany) {
        throw new NotFoundException('Company not found');
      }

      return updatedCompany;
    }

    const updatedCompany = await this._companyRepo.findByIdAndUpdate({
      id: companyId,
      update: {
        $set: {
          bannedAt: new Date(),
        },
      },
    });

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return updatedCompany;
  };

  approveCompany = async (companyId: string) => {
    const company = await this._companyRepo.findById({
      id: companyId,
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.deletedAt) {
      throw new BadRequestException('Cannot approve a deleted company');
    }

    if (company.bannedAt) {
      throw new BadRequestException('Cannot approve a banned company');
    }

    if (company.approvedByAdmin) {
      throw new BadRequestException('Company is already approved');
    }

    company.approvedByAdmin = true;

    await company.save();

    return company;
  };
}
