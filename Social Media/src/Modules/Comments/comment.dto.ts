import { z } from 'zod';
import {
  createCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
  reactCommentSchema,
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

export type ReactCommentParamsDTO = z.infer<typeof reactCommentSchema.params>;
export type ReactCommentQueryDTO = z.infer<typeof reactCommentSchema.query>;

export type GetCommentsParamsDTO = z.infer<typeof getCommentsSchema.params>;
export type GetCommentsQueryDTO = z.infer<typeof getCommentsSchema.query>;
