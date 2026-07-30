import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { BadRequestException } from '../Utils/response/error.response';
import { Types } from 'mongoose';
import { GenderEnum } from '../Utils/enums/auth.enum';

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

export const generalFields = {
  username: z
    .string({ error: 'Username is required' })
    .min(3, { error: 'Username must be at least 3 characters' })
    .max(20, { error: 'Username must be at most 20 characters' }),

  email: z.email({ error: 'Invalid email' }),

  password: z
    .string({ error: 'Password is required' })
    .min(6, { error: 'Password must be at least 6 characters' }),

  confirmPassword: z
    .string({ error: 'Confirm Password is required' })
    .min(6, { error: 'Confirm Password must be at least 6 characters' }),

  gender: z.nativeEnum(GenderEnum, { error: 'Gender must be male or female' }),

  skills: z.array(z.string()),

  age: z
    .number()
    .int()
    .min(18, { error: 'Age must be at least 18' })
    .max(120, { error: 'Age must be at most 120' }),

  role: z.enum(['user', 'admin'], { error: 'Role must be user or admin' }),

  phone: z
    .string()
    .min(10, { error: 'Phone must be at least 10 characters' })
    .max(15, { error: 'Phone must be at most 15 characters' }),

  otp: z.string().regex(/^[0-9]{6}$/),

  id: z.string().refine((value) => {
    return Types.ObjectId.isValid(value);
  }, 'Invalid ObjectId'),
};
