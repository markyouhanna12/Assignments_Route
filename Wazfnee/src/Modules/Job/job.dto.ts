import { generalFields } from '../../Utils/validation/general-fields';
import { JobLocation, WorkingTime, SeniorityLevel } from '../../Utils/enums/job.enum';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddJobDTO {
  @generalFields.string()
  jobTitle!: string;

  @IsEnum(JobLocation)
  jobLocation!: JobLocation;

  @IsEnum(WorkingTime)
  workingTime!: WorkingTime;

  @IsEnum(SeniorityLevel)
  seniorityLevel!: SeniorityLevel;

  @generalFields.string()
  jobDescription!: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  technicalSkills!: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  softSkills!: string[];

  @generalFields.id()
  companyId!: string;
}
export class UpdateJobDTO {
  @IsOptional()
  @generalFields.string()
  jobTitle?: string;

  @IsOptional()
  @IsEnum(JobLocation)
  jobLocation?: JobLocation;

  @IsOptional()
  @IsEnum(WorkingTime)
  workingTime?: WorkingTime;

  @IsOptional()
  @IsEnum(SeniorityLevel)
  seniorityLevel?: SeniorityLevel;

  @IsOptional()
  @generalFields.string()
  jobDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  technicalSkills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  softSkills?: string[];
}

export class JobIdDTO {
  @generalFields.id()
  jobId!: string;
}

export class GetJobsQueryDTO {
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

  @IsOptional()
  @IsString()
  companyName?: string;
}

export class GetJobsParamsDTO {
  @generalFields.id()
  companyId!: string;

  @IsOptional()
  @generalFields.id()
  jobId?: string;
}
