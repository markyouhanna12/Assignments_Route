import { GetNotificationsDTO, NotificationIdDTO } from './notification.dto';

export const notificationValidation = {
  getNotificationsSchema: {
    query: GetNotificationsDTO,
  },
  markAsReadSchema: {
    params: NotificationIdDTO,
  },
};
