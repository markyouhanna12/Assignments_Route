import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EncryptionService } from 'src/Common/Encryption/encryption.service';
import { HUserDocument, User } from 'src/DB/Models/user.model';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { customAlphabet } from 'nanoid';
import { compare, hash } from 'src/Common/Security/hash.security';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
    private readonly mailService: MailService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException(
        'An Account with this email address already exists',
      );
    }

    const otp = customAlphabet('0123456789', 6)();

    const hashedOTP = await hash(otp);

    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 5);

    const encryptedPhone = this.encryptionService.encrypt(
      createUserDto.phoneNumber,
    );

    const newUser = new this.userModel({
      ...createUserDto,
      confirmEmailOTP: hashedOTP,
      otpExpiresAt: expireTime,
      phoneNumber: encryptedPhone,
    });

    const savedUser = await newUser.save();

    this.mailService.sendVerificationOtp(savedUser.email, otp);

    return {
      success: true,
      message:
        'registration successful. Please check your inbox for verification code ',
      user: savedUser,
    };
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
    const user = await this.userModel.findOne({
      email: confirmEmailDto.email,
    });
    if (!user) {
      throw new NotFoundException(
        'No Account record matches this email address',
      );
    }
    if (user.confirmEmail) {
      throw new BadRequestException('This email account has been confirmed');
    }
    if (
      !user.confirmEmailOTP ||
      !(await compare(confirmEmailDto.confirmEmailOTP, user.confirmEmailOTP))
    ) {
      throw new BadRequestException(
        'The verfication code is provided incorrect',
      );
    }
    if (new Date() > user.otpExpiresAt!) {
      throw new BadRequestException(
        'The verfication code has expired. Please sign up again',
      );
    }

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          confirmEmail: new Date(),
        },
        $unset: {
          confirmEmailOTP: 1,
          otpExpiresAt: 1,
        },
      },
    );

    return {
      success: true,
      message: 'Email verified successfully.',
    };
  }
}
