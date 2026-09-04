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

export default router;
