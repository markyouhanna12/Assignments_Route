import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  Max,
  Min,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { Gender } from '../enums/gender.enum';
import { Role } from '../enums/role.enum';

const composeDecorators = (...decorators: PropertyDecorator[]): PropertyDecorator => {
  return (target, propertyKey) => {
    for (const decorator of decorators) {
      decorator(target, propertyKey);
    }
  };
};

@ValidatorConstraint({ name: 'isAdult', async: false })
class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return false;
    }
    const today = new Date();

    let age = today.getFullYear() - value.getFullYear();

    const monthDifference = today.getMonth() - value.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < value.getDate())) {
      age--;
    }

    return age >= 18;
  }
  defaultMessage(): string {
    return 'User must be at least 18 years old';
  }
}

const IsAdult = (): PropertyDecorator => {
  return (object, propertyName) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      validator: IsAdultConstraint,
    });
  };
};

export const generalFields = {
  firstName: () => composeDecorators(IsString(), MinLength(2), Length(2, 50)),

  lastName: () => composeDecorators(IsString(), MinLength(2), Length(2, 50)),

  email: () =>
    composeDecorators(
      IsString({ message: 'Email is required' }),
      IsEmail({}, { message: 'Invalid email address' }),
    ),

  password: () => composeDecorators(IsString(), MinLength(8)),

  confirmPassword: () => composeDecorators(IsString(), MinLength(8)),

  gender: () => composeDecorators(IsEnum(Gender)),

  role: () => composeDecorators(IsEnum(Role)),

  phone: () => composeDecorators(IsString(), IsPhoneNumber('EG')),

  otp: () =>
    composeDecorators(
      IsString(),
      Matches(/^[0-9]{6}$/, {
        message: 'OTP must contain exactly 6 digits',
      }),
    ),

  id: () =>
    composeDecorators(
      IsMongoId({
        message: 'Invalid ObjectId',
      }),
    ),

  age: () => composeDecorators(IsInt(), Min(18), Max(120)),

  skills: () => composeDecorators(IsArray()),

  dob: () => composeDecorators(IsDate(), IsAdult()),

  number: () => composeDecorators(IsNumber()),

  optional: () => composeDecorators(IsOptional()),
};
