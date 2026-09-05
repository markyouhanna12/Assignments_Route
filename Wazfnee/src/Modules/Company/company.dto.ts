import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
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
