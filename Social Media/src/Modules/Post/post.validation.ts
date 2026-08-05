import { z } from 'zod';
import { generalFields } from '../../Middlewares/Validation.middleware';
import { AvailabitlityEnum } from '../../Utils/enums/auth.enum';

export const createPostSchema = {
  body: z.strictObject({
    content: z.string().min(2).max(50000).optional(),

    files: z.array(generalFields.file(['image/png', 'image/jpeg', 'image/jpg'])).optional(),

    tags: z.array(z.string()).optional(),

    availability: z.enum(AvailabitlityEnum).default(AvailabitlityEnum.PUBLIC),
  }),
};

export const reactPostSchema = {
  params: z.strictObject({
    postId: generalFields.id,
  }),
  query: z.strictObject({
    react: z.coerce.number(),
  }),
};

export const updatePostSchema = {
  params: z.strictObject({
    postId: generalFields.id,
  }),

  body: z
    .strictObject({
      content: z.string().min(2).max(50000).optional(),

      files: z.array(generalFields.file(['image/png', 'image/jpeg', 'image/jpg'])).optional(),

      tags: z.array(z.string()).optional(),

      availability: z.enum(AvailabitlityEnum).optional(),
    })
    .refine(
      (data) =>
        data.content !== undefined ||
        data.files !== undefined ||
        data.tags !== undefined ||
        data.availability !== undefined,
      {
        message: 'At least one field is required to update the post',
      },
    ),
};

export const deletePostSchema = {
  params: z.strictObject({
    postId: generalFields.id,
  }),
};

export const getUserPostsSchema = {
  params: z.strictObject({
    userId: generalFields.id,
  }),
};
