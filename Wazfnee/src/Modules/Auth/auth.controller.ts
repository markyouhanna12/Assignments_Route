import { Request, Response } from 'express';
import { ConfirmEmailDTO, GoogleSignUpDTO, SignInDTO, SignUpDTO } from './auth.DTO';
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
  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body as ConfirmEmailDTO;

    const user = await authService.confirmEmail(data);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Email confirmed successfully',
      data: {
        user: {
          _id: user?._id,
          email: user?.email,
          isConfirmed: user?.isConfirmed,
        },
      },
    });
  };

  signin = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body as SignInDTO;

    const { user, accessToken, refreshToken } = await authService.signin(data);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Signed in successfully',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isConfirmed: user.isConfirmed,
        },
        accessToken,
        refreshToken,
      },
    });
  };

  googleSignup = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body as GoogleSignUpDTO;

    const { user, accessToken, refreshToken } = await authService.googleSignup(data);

    return successResponse({
      res,
      statusCode: 201,
      message: 'Google account created successfully',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          provider: user.provider,
          isConfirmed: user.isConfirmed,
        },
        accessToken,
        refreshToken,
      },
    });
  };
}

export const authController = new AuthController();
