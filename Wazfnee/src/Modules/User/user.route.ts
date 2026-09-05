import { Router } from 'express';
import { authentication, authorization } from '../../Middlewares/authentication.middleware';
import { TokenType } from '../../Utils/enums/auth.enum';
import { Role } from '../../Utils/enums/role.enum';
import { validation } from '../../Middlewares/validation.middleware';
import { userValidation } from './user.validation';
import { userController } from './user.controller';
import { fileValidation, localFileUpload } from '../../Utils/multer/local.multer';

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

router.patch(
  '/password',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(userValidation.updatePasswordSchema),
  userController.updatePassword,
);

router.patch(
  '/profile-pic',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  localFileUpload({
    customPath: 'profile',
    validation: fileValidation.images,
    maxFileSize: 5 * 1024 * 1024,
  }).single('profilePic'),
  userController.uploadProfilePic,
);

router.patch(
  '/cover-pic',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  localFileUpload({
    customPath: 'cover',
    validation: fileValidation.images,
    maxFileSize: 5 * 1024 * 1024,
  }).single('coverPic'),
  userController.uploadCoverPic,
);

export default router;
