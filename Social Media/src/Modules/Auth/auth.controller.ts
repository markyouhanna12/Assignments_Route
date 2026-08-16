import express, { Router } from 'express';
import { validation } from '../../Middlewares/Validation.middleware';
import * as authValidation from './auth.validation';
import authService from './auth.service';
import { authentication } from '../../Middlewares/Auth.middleware';
import { TokenTypeEnum } from '../../Utils/enums/auth.enum';

const router: Router = express.Router();

router.post('/signup', validation(authValidation.signupSchema), authService.signup);

router.patch(
  '/confirm-email',
  validation(authValidation.confirmEmailSchema),
  authService.confirmEmail,
);

router.post('/login', validation(authValidation.loginSchema), authService.login);

router.patch(
  '/logout',
  authentication({ tokenType: TokenTypeEnum.ACCESS }),
  validation(authValidation.logoutSchema),
  authService.logoutWithRedis,
);

router.post('/test-notification', authService.testNotification);

export default router;
