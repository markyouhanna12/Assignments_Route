import { UserModel } from '../../DB/Models/user.model';
import { UserRepository } from '../../DB/repositories/user.repository';
import { OTPType } from '../../Utils/enums/otp-type.enum';
import { Provider } from '../../Utils/enums/provider.enum';
import { Role } from '../../Utils/enums/role.enum';
import { emailEvents } from '../../Utils/events/email.event';
import { generateOTP } from '../../Utils/generateOTP';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '../../Utils/response/error.response';
import { genrateHash, compareHash } from '../../Utils/security/hash.security';
import { googleService } from '../../Utils/services/google.service';
import { TokenService } from '../../Utils/services/token.service';
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

export class AuthService {
  private readonly _userRepo = new UserRepository(UserModel);

  signup = async (data: SignUpDTO) => {
    const { firstName, lastName, email, password, gender, dob, mobileNumber } = data;

    const checkUser = await this._userRepo.findOne({
      filter: {
        email,
      },
      select: 'email',
    });
    if (checkUser) {
      throw new ConflictException('User already exists');
    }

    const otp = generateOTP();

    const hashedOTP = await genrateHash(otp);

    const otpExpiresIn = new Date(Date.now() + 10 * 60 * 1000);

    const users = await this._userRepo.create({
      data: [
        {
          firstName,
          lastName,
          email,
          password,
          provider: Provider.SYSTEM,
          gender,
          dob,
          mobileNumber,
          role: Role.USER,
          isConfirmed: false,
          otp: [
            {
              code: hashedOTP,
              type: OTPType.CONFIRM_EMAIL,
              expiresIn: otpExpiresIn,
            },
          ],
        },
      ],
      options: {
        validateBeforeSave: true,
      },
    });

    const user = users?.[0];

    if (!user) {
      throw new ConflictException('Failed to create user');
    }

    emailEvents.emit('confirmEmail', {
      email: user.email,
      firstName: user.firstName,
      otp,
    });

    return user;
  };

  confirmEmail = async (data: ConfirmEmailDTO) => {
    const { email, otp } = data;

    const user = await this._userRepo.findOne({
      filter: {
        email,
      },
      select: 'email isConfirmed otp',
    });
    if (!user) {
      throw new ConflictException('User does not exist');
    }

    if (user.isConfirmed) {
      throw new ConflictException('Email is already confirmed');
    }

    const confirmEmailOTP = user.otp?.find((item) => item.type === OTPType.CONFIRM_EMAIL);

    if (!confirmEmailOTP) {
      throw new ConflictException('Confirmation OTP not found');
    }

    if (confirmEmailOTP.expiresIn.getTime() < Date.now()) {
      throw new ConflictException('Confirmation OTP has expired');
    }

    const isOTPValid = await compareHash(otp, confirmEmailOTP.code);

    if (!isOTPValid) {
      throw new ConflictException('Invalid confirmation OTP');
    }

    const updatedUser = await this._userRepo.findOneAndUpdate({
      filter: {
        _id: user._id,
      },
      update: {
        isConfirmed: true,
        $pull: {
          otp: {
            type: OTPType.CONFIRM_EMAIL,
          },
        },
      },
      select: 'email isConfirmed',
    });

    return updatedUser;
  };

  signin = async (data: SignInDTO) => {
    const { email, password } = data;

    const user = await this._userRepo.findOne({
      filter: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.provider !== Provider.SYSTEM) {
      throw new UnauthorizedException('This account must sign in using its provider');
    }

    if (!user.isConfirmed) {
      throw new UnauthorizedException('Please confirm your email first');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Account has been deleted');
    }

    if (user.bannedAt) {
      throw new UnauthorizedException('Account has been banned');
    }

    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const tokenService = new TokenService();

    const { accessToken, refreshToken } = await tokenService.getNewLoginCredentials({
      _id: user._id.toString(),
      role: user.role,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  };

  googleSignup = async (data: GoogleSignUpDTO) => {
    const googleUser = await googleService.verifyToken(data.credential);

    const existingByProviderId = await this._userRepo.findOne({
      filter: {
        provider: Provider.GOOGLE,
        providerId: googleUser.sub,
      },
    });

    if (existingByProviderId) {
      throw new ConflictException('Google account is already registered');
    }

    const existingByEmail = await this._userRepo.findOne({
      filter: {
        email: googleUser.email,
      },
    });
    if (existingByEmail) {
      throw new ConflictException('Email is already registered');
    }

    const users = await this._userRepo.create({
      data: [
        {
          firstName: googleUser.given_name || 'Google',
          lastName: googleUser.family_name || 'User',
          email: googleUser.email,
          provider: Provider.GOOGLE,
          providerId: googleUser.sub,
          gender: data.gender,
          dob: data.dob,
          mobileNumber: data.mobileNumber,
          role: Role.USER,
          isConfirmed: true,
        },
      ],
      options: {
        validateBeforeSave: true,
      },
    });

    const user = users?.[0];

    if (!user) {
      throw new ConflictException('Failed to create Google account');
    }

    const tokenService = new TokenService();

    const { accessToken, refreshToken } = await tokenService.getNewLoginCredentials({
      _id: user._id.toString(),
      role: user.role,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  };

  googleSignin = async (data: GoogleSignInDTO) => {
    const googleUser = await googleService.verifyToken(data.credential);

    const user = await this._userRepo.findOne({
      filter: {
        provider: Provider.GOOGLE,
        providerId: googleUser.sub,
      },
    });

    if (!user) {
      throw new NotFoundException('Google account is not registered');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Account has been deleted');
    }

    if (user.bannedAt) {
      throw new UnauthorizedException('Account has been banned');
    }
    const tokenService = new TokenService();

    const { accessToken, refreshToken } = await tokenService.getNewLoginCredentials({
      _id: user._id.toString(),
      role: user.role,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  };

  forgetPassword = async (data: ForgetPasswordDTO) => {
    const { email } = data;

    const user = await this._userRepo.findOne({
      filter: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isConfirmed) {
      throw new UnauthorizedException('Please confirm your email first');
    }

    const otp = generateOTP();

    const hashedOTP = await genrateHash(otp);

    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = [
      ...(user.otp ?? []).filter((item) => item.type !== OTPType.FORGET_PASSWORD),
      {
        code: hashedOTP,
        type: OTPType.FORGET_PASSWORD,
        expiresIn,
      },
    ];

    await user.save();

    emailEvents.emit('forgetPassword', {
      email: user.email,
      firstName: user.firstName,
      otp,
    });

    return true;
  };

  resetPassword = async (data: ResetPasswordDTO) => {
    const { email, otp, password } = data;

    const user = await this._userRepo.findOne({
      filter: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.provider !== Provider.SYSTEM) {
      throw new UnauthorizedException('Password reset is only available for system accounts');
    }

    const forgetPasswordOTP = user.otp?.find((item) => item.type === OTPType.FORGET_PASSWORD);

    if (!forgetPasswordOTP) {
      throw new ConflictException('Password reset OTP not found');
    }

    if (forgetPasswordOTP.expiresIn.getTime() < Date.now()) {
      throw new ConflictException('Password reset OTP has expired');
    }

    const isOTPValid = await compareHash(otp, forgetPasswordOTP.code);

    if (!isOTPValid) {
      throw new ConflictException('Invalid password reset OTP');
    }

    user.password = password;
    user.changeCredentialTime = new Date();

    user.otp = (user.otp ?? []).filter((item) => item.type !== OTPType.FORGET_PASSWORD);

    await user.save();

    return true;
  };

  refreshToken = async (refreshToken: string) => {
    const tokenService = new TokenService();

    return await tokenService.refreshAccessToken(refreshToken);
  };
}

export const authService = new AuthService();
