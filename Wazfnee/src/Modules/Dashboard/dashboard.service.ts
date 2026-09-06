import { CompanyModel } from '../../DB/Models/company.model';
import { UserModel } from '../../DB/Models/user.model';
import { CompanyRepository } from '../../DB/repositories/company.repository';
import { UserRepository } from '../../DB/repositories/user.repository';

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
}
