import { z } from 'zod';
import { generalFields } from '../../Middlewares/Validation.middleware';

export const sendMessageSchema = {
  body: z.strictObject({
    to: generalFields.id,
    content: z
      .string()
      .trim()
      .min(1, 'Message content is required')
      .max(50000, 'Message content cannot exceed 50000 characters'),
  }),
};

export const getChatSchema = {
  params: z.strictObject({
    userId: generalFields.id,
  }),

  query: z.strictObject({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(50),
  }),
};

export const markAsReadSchema = {
  body: z.strictObject({
    from: generalFields.id,
  }),
};
