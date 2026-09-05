import { Router } from 'express';
import { validation } from '../../Middlewares/validation.middleware';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import { authentication } from '../../Middlewares/authentication.middleware';
import { TokenType } from '../../Utils/enums/auth.enum';

const router = Router();

router.post('/signup', validation(authValidation.signupSchema), authController.signup);

router.post(
  '/confirm-email',
  validation(authValidation.confirmEmailSchema),
  authController.confirmEmail,
);

router.post('/signin', validation(authValidation.signinSchema), authController.signin);

router.post(
  '/google/signup',
  validation(authValidation.googleSignupSchema),
  authController.googleSignup,
);

router.post(
  '/google/signin',
  validation(authValidation.googleSigninSchema),
  authController.googleSignin,
);

router.post(
  '/forget-password',
  validation(authValidation.forgetPasswordSchema),
  authController.forgetPassword,
);

router.post(
  '/reset-password',
  validation(authValidation.resetPasswordSchema),
  authController.resetPassword,
);

router.post(
  '/refresh-token',
  validation(authValidation.refreshTokenSchema),
  authController.refreshToken,
);

router.post('/logout', authentication({ tokenType: TokenType.ACCESS }), authController.logout);

export default router;
