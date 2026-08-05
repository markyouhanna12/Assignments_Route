import express, { Router } from 'express';
import { authentication, authorization } from '../../Middlewares/Auth.middleware';
import { RoleEnum, TokenTypeEnum } from '../../Utils/enums/auth.enum';
import userService from './user.service';
import { validation } from '../../Middlewares/Validation.middleware';
import * as userValidation from './user.validation';

const router: Router = express.Router();

router.use(
  authentication({
    tokenType: TokenTypeEnum.ACCESS,
  }),
);

router.use(
  authorization({
    accessRoles: [RoleEnum.USER, RoleEnum.ADMIN],
  }),
);

router.get('/profile', userService.getProfile);

router.post(
  '/:userId/friend-request',
  validation(userValidation.sendFriendRequestSchema),
  userService.sendFriendRequest,
);

router.get('/friend-request', userService.listFriendRequests);

router.patch(
  '/:requestId/accept',
  validation(userValidation.acceptFriendRequestSchema),
  userService.acceptFriendRequest,
);

router.delete(
  '/:requestId/reject',
  validation(userValidation.rejectFriendRequestSchema),
  userService.rejectFriendRequest,
);

router.patch(
  '/block/:userId',
  validation(userValidation.blockFriendSchema),
  userService.blockFriend,
);

router.patch(
  '/unblock/:userId',
  validation(userValidation.unblockFriendSchema),
  userService.unblockFriend,
);

export default router;
