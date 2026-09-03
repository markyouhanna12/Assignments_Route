import { Request, Response } from 'express';
import { SignUpDTO } from './auth.DTO';
import { authService } from './auth.service';
import { successResponse } from '../../Utils/response/success.response';

export class AuthController {
  signup = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body as SignUpDTO;

    const user = await authService.signup(data);

    return successResponse({
      res,
      statusCode: 201,
      message: 'User created successfully. Please check your email to confirm your account.',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isConfirmed: user.isConfirmed,
      },
    });
  };
}

export const authController = new AuthController();
