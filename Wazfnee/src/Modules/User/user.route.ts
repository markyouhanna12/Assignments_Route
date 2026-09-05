import { Router } from 'express';
import { authentication, authorization } from '../../Middlewares/authentication.middleware';
import { TokenType } from '../../Utils/enums/auth.enum';
import { Role } from '../../Utils/enums/role.enum';
import { validation } from '../../Middlewares/validation.middleware';
import { userValidation } from './user.validation';
import { userController } from './user.controller';

const router = Router();

router.patch(
  '/account',
  authentication({ tokenType: TokenType.ACCESS }),
  authorization({ accessRoles: [Role.USER] }),
  validation(userValidation.updateAccountSchema),
  userController.updateAccount,
);

router.get(
  '/account',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  userController.getAccount,
);

router.get(
  '/profile/:userId',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(userValidation.getUserProfileSchema),
  userController.getUserProfile,
);

export default router;
