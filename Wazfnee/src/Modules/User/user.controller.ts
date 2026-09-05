import { NextFunction, Request, Response } from 'express';
import { UpdateAccountDTO, UpdatePasswordDTO } from './user.dto';
import { userService } from './user.service';
import { successResponse } from '../../Utils/response/success.response';
import { BadRequestException } from '../../Utils/response/error.response';

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

  getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params as any;

    const user = await userService.getUserProfile(userId);

    return successResponse({
      res,
      statusCode: 200,
      message: 'User profile retrieved successfully',
      data: {
        user: {
          username: user.username,
          mobileNumber: user.mobileNumber,
          profilePic: user.profilePic,
          coverPic: user.coverPic,
        },
      },
    });
  };

  updatePassword = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body as UpdatePasswordDTO;

    await userService.updatePassword(req.user._id.toString(), data);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Password updated successfully',
    });
  };

  uploadProfilePic = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) {
      throw new BadRequestException('Profile picture is required');
    }

    const profilePic = await userService.uploadProfilePic(req.user._id.toString(), req.file);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePic,
      },
    });
  };

  uploadCoverPic = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) {
      throw new BadRequestException('Cover picture is required');
    }

    const coverPic = await userService.uploadCoverPic(req.user._id.toString(), req.file);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Cover picture uploaded successfully',
      data: {
        coverPic,
      },
    });
  };

  deleteProfilePic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await userService.deleteProfilePic(req.user._id.toString());

      res.status(200).json({
        message: 'Profile picture deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCoverPic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await userService.deleteCoverPic(req.user._id.toString());

      res.status(200).json({
        message: 'Cover picture deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
