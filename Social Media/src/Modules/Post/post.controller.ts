import express, { Router } from 'express';
import { authentication, authorization } from '../../Middlewares/Auth.middleware';
import { RoleEnum, TokenTypeEnum } from '../../Utils/enums/auth.enum';
import { fileValidation, localFileUpload } from '../../Utils/multer/local.multer';
import { validation } from '../../Middlewares/Validation.middleware';
import * as postValidation from './post.validation';
import postService from './post.service';

const router: Router = express.Router();

router.use(
  authentication({
    tokenType: TokenTypeEnum.ACCESS,
  }),
);
router.use(
  authorization({
    accessRoles: [RoleEnum.ADMIN, RoleEnum.USER],
  }),
);

router.post(
  '/',
  localFileUpload({
    validation: fileValidation.images,
    customPath: 'posts',
  }).array('attachments', 10),
  validation(postValidation.createPostSchema),
  postService.createPost,
);

router.patch('/:postId/react', validation(postValidation.reactPostSchema), postService.reactPost);

export default router;
