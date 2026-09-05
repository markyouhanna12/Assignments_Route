import { Type } from 'class-transformer';

import { Gender } from '../../Utils/enums/gender.enum';
import { generalFields } from '../../Utils/validation/general-fields';

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
