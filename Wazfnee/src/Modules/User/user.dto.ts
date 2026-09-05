import { Type } from 'class-transformer';

import { Gender } from '../../Utils/enums/gender.enum';
import { generalFields } from '../../Utils/validation/general-fields';
import { IsMatch } from '../../Utils/validation/decorators/match.decorator';

export class UpdateAccountDTO {
  @generalFields.optional()
  @generalFields.firstName()
  firstName?: string;

  @generalFields.optional()
  @generalFields.lastName()
  lastName?: string;

  @generalFields.optional()
  @generalFields.gender()
  gender?: Gender;

  @generalFields.optional()
  @Type(() => Date)
  @generalFields.dob()
  dob?: Date;

  @generalFields.optional()
  @generalFields.phone()
  mobileNumber?: string;
}

export class GetUserProfileDTO {
  @generalFields.id()
  userId!: string;
}

export class UpdatePasswordDTO {
  @generalFields.password()
  currentPassword!: string;

  @generalFields.password()
  newPassword!: string;

  @generalFields.confirmPassword()
  @IsMatch('newPassword')
  confirmPassword!: string;
}
