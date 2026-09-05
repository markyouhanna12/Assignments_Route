import { NextFunction, Request, Response } from 'express';
import {
  ConfirmEmailDTO,
  ForgetPasswordDTO,
  GoogleSignInDTO,
  GoogleSignUpDTO,
  RefreshTokenDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from './auth.DTO';
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

  googleSignin = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body as GoogleSignInDTO;

    const { user, accessToken, refreshToken } = await authService.googleSignin(data);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Google sign in successful',
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

  forgetPassword = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body as ForgetPasswordDTO;

    await authService.forgetPassword(data);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Password reset OTP sent successfully',
    });
  };

  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body as ResetPasswordDTO;

    await authService.resetPassword(data);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Password reset successfully',
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const { refreshToken } = req.body as RefreshTokenDTO;

    const { accessToken } = await authService.refreshToken(refreshToken);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Access token refreshed successfully',
      data: {
        accessToken,
      },
    });
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    await authService.logout({
      userId: req.user._id.toString(),
      jti: req.decoded.jti,
    });

    return successResponse({
      res,
      statusCode: 200,
      message: 'Logged out successfully',
    });
  };

  requestRestoreAccount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await authService.requestRestoreAccount(req.body.email, req.body.password);

      res.status(200).json({
        message: 'Restore OTP has been sent to your email',
      });
    } catch (error) {
      next(error);
    }
  };

  restoreAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await authService.restoreAccount(req.body.email, req.body.otp);

      res.status(200).json({
        message: 'Account restored successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
