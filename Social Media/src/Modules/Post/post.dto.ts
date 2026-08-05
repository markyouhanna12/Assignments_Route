import { z } from 'zod';
import { createPostSchema, updatePostSchema } from './post.validation';

export type ICreatePostDTO = z.infer<typeof createPostSchema.body>;
export type IUpdatePostDTO = z.infer<typeof updatePostSchema.body>;
