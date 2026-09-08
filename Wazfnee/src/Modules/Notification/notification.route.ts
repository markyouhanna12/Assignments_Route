import { Router } from 'express';
import { authentication, authorization } from '../../Middlewares/authentication.middleware';
import { validation } from '../../Middlewares/validation.middleware';
import { GetNotificationsDTO } from './notification.dto';
import { NotificationController } from './notification.controller';
import { TokenType } from '../../Utils/enums/auth.enum';
import { Role } from '../../Utils/enums/role.enum';
import { notificationValidation } from './notification.validation';

const router = Router();

const notificationController = new NotificationController();

router.get(
  '/',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(notificationValidation.getNotificationsSchema),

  notificationController.getUserNotifications,
);

router.patch(
  '/:notificationId/read',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(notificationValidation.markAsReadSchema),
  notificationController.markAsRead,
);

router.post(
  '/device',
  authentication({
    tokenType: TokenType.ACCESS,
  }),
  authorization({
    accessRoles: [Role.USER],
  }),
  validation(notificationValidation.registerDeviceSchema),
  notificationController.registerDevice,
);

export default router;
