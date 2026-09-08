import { GetNotificationsDTO, NotificationIdDTO, RegisterDeviceDTO } from './notification.dto';

export const notificationValidation = {
  getNotificationsSchema: {
    query: GetNotificationsDTO,
  },
  markAsReadSchema: {
    params: NotificationIdDTO,
  },
  registerDeviceSchema: {
    body: RegisterDeviceDTO,
  },
};
