import { UserModel } from '../../DB/Models/user.model';
import { UserRepository } from '../../DB/repositories/user.repository';
import { deleteLocalFile } from '../../Utils/multer/local-file.utils';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../../Utils/response/error.response';
import { compareHash } from '../../Utils/security/hash.security';
import { UpdateAccountDTO, UpdatePasswordDTO } from './user.dto';

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

  updatePassword = async (userId: string, data: UpdatePasswordDTO) => {
    const user = await this._userRepo.findById({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.password) {
      throw new BadRequestException('This account does not have a password');
    }

    const isPasswordValid = await compareHash(data.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const isSamePassword = await compareHash(data.newPassword, user.password);

    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    user.password = data.newPassword;
    user.changeCredentialTime = new Date();

    await user.save();

    return true;
  };

  uploadProfilePic = async (userId: string, file: Express.Multer.File) => {
    const user = await this._userRepo.findById({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profilePic = {
      secure_url: `/uploads/profile/${userId}/${file.filename}`,
      public_id: file.filename,
    };

    await user.save();

    return user.profilePic;
  };

  uploadCoverPic = async (userId: string, file: Express.Multer.File) => {
    const user = await this._userRepo.findById({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.coverPic = {
      secure_url: `/uploads/cover/${userId}/${file.filename}`,
      public_id: file.filename,
    };

    await user.save();

    return user.coverPic;
  };

  deleteProfilePic = async (userId: string): Promise<{ profilePic: null }> => {
    const user = await this._userRepo.findById({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.profilePic?.secure_url) {
      throw new BadRequestException('User does not have a profile picture');
    }

    await deleteLocalFile(user.profilePic.secure_url);

    await user.updateOne({
      $unset: {
        profilePic: 1,
      },
    });

    return {
      profilePic: null,
    };
  };

  deleteCoverPic = async (userId: string): Promise<{ coverPic: null }> => {
    const user = await this._userRepo.findById({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.coverPic?.secure_url) {
      throw new BadRequestException('User does not have a cover picture');
    }

    // Delete the physical file
    await deleteLocalFile(user.coverPic.secure_url);

    // Remove coverPic field from MongoDB
    await user.updateOne({
      $unset: {
        coverPic: 1,
      },
    });

    return {
      coverPic: null,
    };
  };
}

export const userService = new UserService();
