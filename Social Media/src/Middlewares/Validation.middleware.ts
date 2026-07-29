import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { BadRequestException } from '../Utils/response/error.response';
import { Types } from 'mongoose';

type KeyReqType = keyof Request;
type SchemaType = Partial<Record<KeyReqType, z.ZodType>>;

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction): NextFunction => {
    const validationError: Array<{
      key: KeyReqType;
      issues: Array<{ message: string; path: (string | number | symbol)[]; code?: string }>;
    }> = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {
      if (!schema[key]) {
        continue;
      }
      const validationResult = schema[key].safeParse(req[key]);

      if (!validationResult.success) {
        const errors = validationResult.error as ZodError;

        validationError.push({
          key: key,
          issues: errors.issues.map((issue) => ({
            message: issue.message,
            path: issue.path,
            code: issue.code,
          })),
        });
      }
    }

    if (validationError.length > 0) {
      throw new BadRequestException('Validation failed', { cause: validationError });
    }
    return next() as unknown as NextFunction;
  };
};
