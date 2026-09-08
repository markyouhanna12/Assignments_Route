import { Type } from 'class-transformer';
import { IsInt, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';
import { generalFields } from '../../Utils/validation/general-fields';

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
