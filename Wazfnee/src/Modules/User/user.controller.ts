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
}

export const userController = new UserController();
