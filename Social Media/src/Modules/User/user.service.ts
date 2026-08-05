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

  listFriendRequests = async (req: Request, res: Response): Promise<Response> => {
    const friendRequest = await FriendModel.find({
      sendTo: req.user!._id,
      acceptedAt: { $exists: false },
    })
      .populate('sendBy', 'firstName lastName email -_id')
      .lean();

    return successResponse({
      res,
      statusCode: 200,
      message: 'Done',
      data: { friendRequest },
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

  acceptFriendRequest = async (req: Request, res: Response): Promise<Response> => {
    const { requestId } = req.params as unknown as { requestId: Types.ObjectId };

    const checkFriendRequestExists = await this._friendRepo.findOneAndUpdate({
      filter: {
        _id: requestId,
        sendTo: req.user?._id,
        acceptedAt: { $exists: false },
      },
      update: {
        acceptedAt: new Date(),
      },
    });

    if (!checkFriendRequestExists) {
      throw new NotFoundException('Friend Request not found');
    }

    await Promise.all([
      await this._userRepo.updateOne({
        filter: {
          _id: checkFriendRequestExists.sendBy,
        },
        update: {
          $addToSet: {
            friends: checkFriendRequestExists.sendTo,
          },
        },
      }),
      await this._userRepo.updateOne({
        filter: {
          _id: checkFriendRequestExists.sendTo,
        },
        update: {
          $addToSet: {
            friends: checkFriendRequestExists.sendBy,
          },
        },
      }),
    ]);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Friend Request Accepted',
    });
  };

  rejectFriendRequest = async (req: Request, res: Response): Promise<Response> => {
    const { requestId } = req.params as unknown as { requestId: Types.ObjectId };

    const friendRequest = await this._friendRepo.findOneAndDelete({
      filter: {
        _id: requestId,
        $or: [{ sendTo: req.user!._id }, { sendBy: req.user!._id }],
        acceptedAt: { $exists: false },
      },
    });

    if (!friendRequest) {
      throw new NotFoundException('Friend Request not found');
    }

    return successResponse({
      res,
      statusCode: 200,
      message: 'Friend Request Removed',
    });
  };
}

export default new UserService();
