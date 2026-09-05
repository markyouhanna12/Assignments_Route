import { Transform, Type } from 'class-transformer';
import { generalFields } from '../../Utils/validation/general-fields';
import { IsMatch } from '../../Utils/validation/decorators/match.decorator';
import { Gender } from '../../Utils/enums/gender.enum';
import { IsString } from 'class-validator';

export class SignUpDTO {
  @generalFields.firstName()
  firstName!: string;

  @generalFields.lastName()
  lastName!: string;

  @generalFields.email()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @generalFields.password()
  password!: string;

  @generalFields.confirmPassword()
  @IsMatch('password')
  confirmPassword!: string;

  @generalFields.gender()
  gender!: Gender;

  @Type(() => Date)
  @generalFields.dob()
  dob!: Date;

  @generalFields.phone()
  mobileNumber!: string;
}

export class ConfirmEmailDTO {
  @generalFields.email()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @generalFields.otp()
  otp!: string;
}

export class SignInDTO {
  @generalFields.email()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @generalFields.password()
  password!: string;
}

export class GoogleSignUpDTO {
  @IsString()
  credential!: string;

  @generalFields.gender()
  gender!: Gender;

  @Type(() => Date)
  @generalFields.dob()
  dob!: Date;

  @generalFields.phone()
  mobileNumber!: string;
}

export class GoogleSignInDTO {
  @IsString()
  credential!: string;
}

export class ForgetPasswordDTO {
  @generalFields.email()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;
}

export class ResetPasswordDTO {
  @generalFields.email()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @generalFields.otp()
  otp!: string;

  @generalFields.password()
  password!: string;

  @generalFields.confirmPassword()
  @IsMatch('password')
  confirmPassword!: string;
}

export class RefreshTokenDTO {
  @IsString()
  refreshToken!: string;
}
