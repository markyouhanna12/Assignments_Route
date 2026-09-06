import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { generalFields } from '../../Utils/validation/general-fields';
import { CompanySize } from '../../Utils/enums/company.enum';

export class AddCompanyDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  industry!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  address!: string;

  @IsEnum(CompanySize)
  numberOfEmployees!: CompanySize;

  @generalFields.email()
  companyEmail!: string;
}

export class UpdateCompanyDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  companyName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsEnum(CompanySize)
  numberOfEmployees?: CompanySize;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  companyEmail?: string;
}

export class CompanyIdDTO {
  @generalFields.id()
  companyId!: string;
}
