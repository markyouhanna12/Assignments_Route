import express, { Router } from 'express';
import { authentication, authorization } from '../../Middlewares/Auth.middleware';
import { RoleEnum, TokenTypeEnum } from '../../Utils/enums/auth.enum';
import * as commentValidation from './comment.validation';
import { validation } from '../../Middlewares/Validation.middleware';
import commentService from './comment.service';

const router: Router = express.Router({ mergeParams: true });

router.use(authentication({ tokenType: TokenTypeEnum.ACCESS }));
router.use(authorization({ accessRoles: [RoleEnum.ADMIN, RoleEnum.USER] }));

router.post('/', validation(commentValidation.createCommentSchema), commentService.createComment);

router.post(
  '/:commentId/reply',
  validation(commentValidation.replyCommentSchema),
  commentService.createReply,
);

router.patch(
  '/:commentId',
  validation(commentValidation.updateCommentSchema),
  commentService.updateComment,
);

router.delete(
  '/:commentId',
  validation(commentValidation.deleteCommentSchema),
  commentService.deleteComment,
);

router.patch(
  '/:commentId/react',
  validation(commentValidation.reactCommentSchema),
  commentService.reactComment,
);

router.get('/', validation(commentValidation.getCommentsSchema), commentService.getComments);

export default router;
