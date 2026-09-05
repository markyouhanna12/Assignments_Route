import { UserModel } from '../../DB/Models/user.model';
import { UserRepository } from '../../DB/repositories/user.repository';
import { NotFoundException } from '../../Utils/response/error.response';
import { UpdateAccountDTO } from './user.dto';

export class UserService {
  private readonly _userRepo = new UserRepository(UserModel);

  updateAccount = async (userId: string, data: UpdateAccountDTO) => {
    const user = await this._userRepo.findById({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.firstName !== undefined) {
      user.firstName = data.firstName;
    }
    if (data.lastName !== undefined) {
      user.lastName = data.lastName;
    }

    if (data.gender !== undefined) {
      user.gender = data.gender;
    }

    if (data.dob !== undefined) {
      user.dob = data.dob;
    }

    if (data.mobileNumber !== undefined) {
      user.mobileNumber = data.mobileNumber;
    }

    await user.save();

    return user;
  };

  getAccount = async (userId: string) => {
    const user = await this._userRepo.findById({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  };

  getUserProfile = async (userId: string) => {
    const user = await this._userRepo.findById({
      id: userId,
      select: 'firstName lastName mobileNumber profilePic coverPic',
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  };
}

export const userService = new UserService();
