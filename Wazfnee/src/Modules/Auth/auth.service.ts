import { UserModel } from '../../DB/Models/user.model';
import { UserRepository } from '../../DB/repositories/user.repository';
import { OTPType } from '../../Utils/enums/otp-type.enum';
import { Provider } from '../../Utils/enums/provider.enum';
import { Role } from '../../Utils/enums/role.enum';
import { emailEvents } from '../../Utils/events/email.event';
import { generateOTP } from '../../Utils/generateOTP';
import { ConflictException } from '../../Utils/response/error.response';
import { genrateHash } from '../../Utils/security/hash.security';
import { SignUpDTO } from './auth.DTO';

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
}

export const authService = new AuthService();
