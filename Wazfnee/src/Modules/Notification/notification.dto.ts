import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { generalFields } from '../../Utils/validation/general-fields';
import { DevicePlatform } from '../../DB/Models/firebase-device.model';

export class GetNotificationsDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort?: string = '-createdAt';
}

export class NotificationIdDTO {
  @generalFields.id()
  notificationId!: string;
}

export class RegisterDeviceDTO {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsEnum(DevicePlatform)
  platform!: DevicePlatform;
}
