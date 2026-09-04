import { UserModel } from '../../DB/Models/user.model';
import { UserRepository } from '../../DB/repositories/user.repository';
import { OTPType } from '../../Utils/enums/otp-type.enum';
import { Provider } from '../../Utils/enums/provider.enum';
import { Role } from '../../Utils/enums/role.enum';
import { emailEvents } from '../../Utils/events/email.event';
import { generateOTP } from '../../Utils/generateOTP';
import { ConflictException } from '../../Utils/response/error.response';
import { genrateHash, compareHash } from '../../Utils/security/hash.security';
import { ConfirmEmailDTO, SignUpDTO } from './auth.DTO';

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
}

export const authService = new AuthService();
