import { Request, Response } from 'express';
import { UserModel } from '../../DB/Models/user.model';
import { UserRepository } from '../../DB/repositories/user.repo';
import { TokenService } from '../../Utils/services/token';
import { confirmEmailDTO, loginDTO, signupDTO } from './auth.DTO';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '../../Utils/response/error.response';
import { generateOTP } from '../../Utils/generateOTP';
import { compareHash, genrateHash } from '../../Utils/security/hash';
import { successResponse } from '../../Utils/response/success.response';
import { emailEvents } from '../../Utils/events/email.event';

class AuthenticationService {
  private _userRepo = new UserRepository(UserModel);
  private _tokenService: TokenService;
  constructor() {
    this._tokenService = new TokenService();
  }

  signup = async (req: Request, res: Response): Promise<Response> => {
    const { username, email, password, phone }: signupDTO = req.body;

    const checkUser = await this._userRepo.findOne({
      filter: { email },
      select: 'email',
    });
    if (checkUser) {
      throw new ConflictException('User already exists');
    }
    const otp = generateOTP();

    const hashedPassword = await genrateHash(password);

    const user = await this._userRepo.create({
      data: [
        {
          username,
          email,
          password: hashedPassword,
          phone,
          confirmEmailOTP: await genrateHash(otp),
        },
      ],
      options: { validateBeforeSave: true },
    });

    await emailEvents.emit('confirmEmail', {
      to: email,
      username,
      otp,
    });

    return successResponse({
      res,
      statusCode: 200,
      message: 'User created successfully',
      data: { user },
    });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp }: confirmEmailDTO = req.body;

    const user = await this._userRepo.findOne({
      filter: {
        email,
        confirmEmailOTP: { $exists: true },
        confirmEmailAt: { $exists: false },
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found or Already confirmed');
    }
    if (!compareHash(otp, user?.confirmEmailOTP as string)) {
      throw new BadRequestException('Invalid OTP');
    }
    await this._userRepo.updateOne({
      filter: { email },
      update: {
        confirmEmailAt: Date.now(),
        $unset: { confirmEmailOTP: true },
      },
    });

    return successResponse({
      res,
      statusCode: 200,
      message: 'Email confirmed successfully',
    });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: loginDTO = req.body;
    const user = await this._userRepo.findOne({
      filter: {
        email,
        confirmEmailAt: { $exists: true },
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found or Not confirmed');
    }

    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const credentails = await this._tokenService.getNewLoginCredentials(user as any);

    return successResponse({
      res,
      statusCode: 200,
      message: 'Login successful',
      data: { credentails },
    });
  };
}

export default new AuthenticationService();
