import { z } from 'zod';
import { createCommentSchema, replyCommentSchema } from './comment.validation';

export type CreateCommentBodyDTO = z.infer<typeof createCommentSchema.body>;
export type CreateCommentParamsDTO = z.infer<typeof createCommentSchema.params>;

export type ReplyCommentBodyDTO = z.infer<typeof replyCommentSchema.body>;
export type ReplyCommentParamsDTO = z.infer<typeof replyCommentSchema.params>;
