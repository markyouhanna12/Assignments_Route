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
