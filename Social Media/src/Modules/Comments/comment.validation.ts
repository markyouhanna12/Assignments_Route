import { z } from 'zod';
import { generalFields } from '../../Middlewares/Validation.middleware';

export const createCommentSchema = {
  params: z.strictObject({
    postId: generalFields.id,
  }),
  body: z
    .strictObject({
      content: z.string().optional(),
      tags: z.array(generalFields.id).optional(),
    })
    .superRefine((args, ctx) => {
      if (args.tags?.length) {
        const uniqueTags = [...new Set(args.tags)];
        if (uniqueTags.length !== args.tags.length) {
          ctx.addIssue({
            code: 'custom',
            message: 'Duplicate tags are not allowed',
            path: ['tags'],
          });
        }
      }
    }),
};

export const replyCommentSchema = {
  params: z.strictObject({
    postId: generalFields.id,
    commentId: generalFields.id,
  }),
  body: createCommentSchema.body,
};

export const updateCommentSchema = {
  params: z.strictObject({
    postId: generalFields.id,
    commentId: generalFields.id,
  }),
  body: createCommentSchema.body,
};

export const deleteCommentSchema = {
  params: z.strictObject({
    postId: generalFields.id,
    commentId: generalFields.id,
  }),
};

export const reactCommentSchema = {
  params: z.strictObject({
    postId: generalFields.id,
    commentId: generalFields.id,
  }),
  query: z.strictObject({
    react: z.coerce.number().refine((value) => value === 1 || value === -1, {
      message: 'react must be either 1 or -1',
    }),
  }),
};
