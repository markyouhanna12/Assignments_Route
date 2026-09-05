import { Request, Response } from 'express';
import { UpdateAccountDTO } from './user.dto';
import { userService } from './user.service';
import { successResponse } from '../../Utils/response/success.response';

export class UserController {
  updateAccount = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body as UpdateAccountDTO;

    const user = await userService.updateAccount(req.user._id.toString(), data);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Account updated successfully',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender,
          dob: user.dob,
          isConfirmed: user.isConfirmed,
        },
      },
    });
  };
  getAccount = async (req: Request, res: Response): Promise<Response> => {
    const user = await userService.getAccount(req.user._id.toString());

    return successResponse({
      res,
      statusCode: 200,
      message: 'Account data retrieved successfully',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          provider: user.provider,
          gender: user.gender,
          dob: user.dob,
          mobileNumber: user.mobileNumber,
          role: user.role,
          isConfirmed: user.isConfirmed,
          profilePic: user.profilePic,
          coverPic: user.coverPic,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  };
}

export const userController = new UserController();
