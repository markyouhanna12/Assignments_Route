import { Router } from 'express';
import { validation } from '../../Middlewares/validation.middleware';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';

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

export default router;
