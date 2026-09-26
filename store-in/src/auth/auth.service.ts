import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EncryptionService } from 'src/Common/Encryption/encryption.service';
import { HUserDocument, User } from 'src/DB/Models/user.model';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { customAlphabet } from 'nanoid';
import { hash } from 'src/Common/Security/hash.security';

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
}
