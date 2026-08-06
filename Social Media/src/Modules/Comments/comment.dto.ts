import { z } from 'zod';
import {
  createCommentSchema,
  deleteCommentSchema,
  replyCommentSchema,
  updateCommentSchema,
} from './comment.validation';

export type CreateCommentBodyDTO = z.infer<typeof createCommentSchema.body>;
export type CreateCommentParamsDTO = z.infer<typeof createCommentSchema.params>;

export type ReplyCommentBodyDTO = z.infer<typeof replyCommentSchema.body>;
export type ReplyCommentParamsDTO = z.infer<typeof replyCommentSchema.params>;

export type UpdateCommentBodyDTO = z.infer<typeof updateCommentSchema.body>;
export type UpdateCommentParamsDTO = z.infer<typeof updateCommentSchema.params>;

export type DeleteCommentParamsDTO = z.infer<typeof deleteCommentSchema.params>;
