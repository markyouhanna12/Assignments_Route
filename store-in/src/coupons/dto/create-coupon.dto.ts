import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { CouponType } from 'src/DB/Models/coupon.model';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'Coupon code can only contain letters, numbers, hyphens, and underscores.',
  })
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(CouponType)
  type!: CouponType;

  @IsNumber()
  @IsPositive()
  value!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsDateString()
  expiresAt!: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUses?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsesPerUser?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumPurchase?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maximumDiscount?: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  products?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  brands?: string[];
}
