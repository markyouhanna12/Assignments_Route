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
import { notificationEvent } from '../../Utils/events/notification.event';

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
    const { userId } = req.params as { userId: string };

    const recipientId = new Types.ObjectId(userId);

    const checkFriendRequestExists = await this._friendRepo.findOne({
      filter: {
        sendBy: { $in: [req.user?._id, recipientId] },
        sendTo: { $in: [req.user?._id, recipientId] },
      },
    });

    if (checkFriendRequestExists) {
      throw new ConflictException('Friend Request already Exists');
    }

    const user = await this._userRepo.findOne({
      filter: {
        _id: recipientId,
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
            sendTo: recipientId,
          },
        ],
      })) || [];

    if (!friend) {
      throw new BadRequestException('Fail to send friend Request');
    }

    notificationEvent.emit('friendRequest', {
      to: recipientId,
      sender: {
        _id: req.user?._id as Types.ObjectId,
        firstName: req.user?.firstName as string,
        lastName: req.user?.lastName as string,
      },
      requestId: friend._id,
    });

    return successResponse({
      res,
      statusCode: 201,
      message: 'Friend Request Sent',
      data: friend,
    });
  };

  acceptFriendRequest = async (req: Request, res: Response): Promise<Response> => {
    const { requestId } = req.params as { requestId: string };

    if (!Types.ObjectId.isValid(requestId)) {
      throw new BadRequestException('Invalid request ID');
    }
    const requestObjectId = new Types.ObjectId(requestId);

    const checkFriendRequestExists = await this._friendRepo.findOneAndUpdate({
      filter: {
        _id: requestObjectId,
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

    notificationEvent.emit('friendAccepted', {
      to: checkFriendRequestExists.sendBy,
      sender: {
        _id: req.user?._id as Types.ObjectId,
        firstName: req.user?.firstName as string,
        lastName: req.user?.lastName as string,
      },
    });

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

  removeFriend = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as { userId: string };
    const myId = req.user!._id;

    await Promise.all([
      this._userRepo.updateOne({
        filter: {
          _id: myId,
        },
        update: {
          $pull: {
            friends: userId,
          },
        },
      }),

      this._userRepo.updateOne({
        filter: {
          _id: userId,
        },
        update: {
          $pull: {
            friends: myId,
          },
        },
      }),
    ]);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Friend has been Removed successfully',
    });
  };

  blockFriend = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as { userId: string };
    const myId = req.user!._id;

    if (userId === myId.toString()) {
      throw new BadRequestException('You cannot block yourself');
    }
    const target = await this._userRepo.findById({
      id: userId,
    });
    if (!target) {
      throw new NotFoundException('User Not Found');
    }

    await Promise.all([
      this._userRepo.updateOne({
        filter: { _id: myId },
        update: {
          $addToSet: { blockedUsers: new Types.ObjectId(userId) },
          $pull: { friends: userId },
        },
      }),

      this._userRepo.updateOne({
        filter: { _id: userId },
        update: { $pull: { friends: myId } },
      }),

      this._friendRepo.deleteMany({
        filter: {
          $or: [
            { sendBy: myId, sendTo: userId },
            { sendBy: userId, sendTo: myId },
          ],
        },
      }),
    ]);

    return successResponse({
      res,
      statusCode: 200,
      message: 'User has been blocked',
    });
  };

  unblockFriend = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as { userId: string };
    const myId = req.user!._id;

    if (userId === myId.toString()) {
      throw new BadRequestException('You cannot unblock yourself');
    }

    const target = await this._userRepo.findById({
      id: userId,
    });
    if (!target) {
      throw new NotFoundException('User Not Found');
    }

    await Promise.all([
      this._userRepo.updateOne({
        filter: { _id: myId },
        update: {
          $pull: { blockedUsers: new Types.ObjectId(userId) },
        },
      }),
    ]);

    return successResponse({
      res,
      statusCode: 200,
      message: 'User has been unblocked',
    });
  };
}

export default new UserService();
