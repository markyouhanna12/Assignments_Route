import z from 'zod';
import { generalFields } from '../../Middlewares/Validation.middleware';

export const sendFriendRequestSchema = {
  params: z.strictObject({
    userId: generalFields.id,
  }),
};

export const acceptFriendRequestSchema = {
  params: z.strictObject({
    requestId: generalFields.id,
  }),
};
