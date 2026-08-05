import { Request, Response } from 'express';
import { UserModel } from '../../DB/Models/user.model';
import { UserRepository } from '../../DB/repositories/user.repo';
import { decrypt } from '../../Utils/security/encryption';
import { successResponse } from '../../Utils/response/success.response';
import { Types } from 'mongoose';
import { FriendRepository } from '../../DB/repositories/friend.repo';
import { FriendModel } from '../../DB/Models/friendRequest.model';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '../../Utils/response/error.response';

class UserService {
  private _userRepo = new UserRepository(UserModel);
  private _friendRepo = new FriendRepository(FriendModel);

  constructor() {}

  getProfile = async (req: Request, res: Response): Promise<Response> => {
    const userProfile = req.user;

    userProfile.phone = await decrypt(userProfile.phone);

    return successResponse({
      res,
      message: 'Done',
      statusCode: 200,
      data: userProfile,
    });
  };

  sendFriendRequest = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as unknown as { userId: Types.ObjectId };

    const checkFriendRequestExists = await this._friendRepo.findOne({
      filter: {
        sendBy: { $in: [req.user?._id, userId] },
        sendTo: { $in: [req.user?._id, userId] },
      },
    });

    if (checkFriendRequestExists) {
      throw new ConflictException('Friend Request already Exists');
    }

    const user = await this._userRepo.findOne({
      filter: {
        _id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [friend] =
      (await this._friendRepo.create({
        data: [
          {
            sendBy: req.user?._id as Types.ObjectId,
            sendTo: userId,
          },
        ],
      })) || [];

    if (!friend) {
      throw new BadRequestException('Fail to send friend Request');
    }

    return successResponse({
      res,
      statusCode: 201,
      message: 'Friend Request Sent',
      data: friend,
    });
  };
}

export default new UserService();
