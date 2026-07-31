import express, { Router } from 'express';
import { authentication, authorization } from '../../Middlewares/Auth.middleware';
import { RoleEnum, TokenTypeEnum } from '../../Utils/enums/auth.enum';
import userService from './user.service';

const router: Router = express.Router();

router.get(
  '/profile',
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [RoleEnum.USER, RoleEnum.ADMIN] }),
  userService.getProfile,
);

export default router;
