import { z } from 'zod';
import { generalFields } from '../../Middlewares/Validation.middleware';

export const loginSchema = {
  body: z.strictObject({
    email: generalFields.email,

    password: generalFields.password,
  }),
};

export const signupSchema = {
  body: loginSchema.body
    .extend({
      username: generalFields.username,

      confirmPassword: generalFields.password,

      gender: generalFields.gender.optional(),

      skills: generalFields.skills.optional(),

      age: generalFields.age.optional(),

      phone: generalFields.phone,

      role: generalFields.role.optional(),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: "Passwords don't match",
          path: ['confirmPassword'],
        });
      }
      if (data.username.split(' ').length !== 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'Username must be 2 words',
          path: ['username'],
        });
      }
    }),
};

export const confirmEmailSchema = {
  body: z.strictObject({
    email: generalFields.email,

    otp: generalFields.otp,
  }),
};
