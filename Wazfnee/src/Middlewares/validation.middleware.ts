import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../Utils/response/error.response';

type ValidationSource = 'body' | 'params' | 'query' | 'headers';

interface ValidationSchema {
  body?: new () => object;
  params?: new () => object;
  query?: new () => object;
  headers?: new () => object;
}

interface IFormattedValidationError {
  property: string;
  constraints?: Record<string, string>;
  children?: ValidationError[];
}

const formatValidationErrors = (errors: ValidationError[]): IFormattedValidationError[] => {
  return errors.map((error) => {
    const formattedError: IFormattedValidationError = {
      property: error.property,
    };

    if (error.constraints) {
      formattedError.constraints = error.constraints;
    }

    if (error.children?.length) {
      formattedError.children = error.children;
    }

    return formattedError;
  });
};

export const validation = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationErrors: Array<{
      key: ValidationSource;
      errors: ValidationError[];
    }> = [];

    for (const key of Object.keys(schema) as ValidationSource[]) {
      const DTOClass = schema[key];

      if (!DTOClass) {
        continue;
      }

      const dtoInstance = plainToInstance(DTOClass, req[key], {
        enableImplicitConversion: true,
      });

      const errors = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      });

      if (errors.length > 0) {
        validationErrors.push({
          key,
          errors: formatValidationErrors(errors),
        });

        continue;
      }

      req[key] = dtoInstance as never;
    }

    if (validationErrors.length > 0) {
      throw new BadRequestException('Validation failed', {
        cause: validationErrors,
      });
    }

    next();
  };
};
