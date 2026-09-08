import { Types } from 'mongoose';
import { INotification, NotificationModel } from '../../DB/Models/notification.model';
import { NotificationRepository } from '../../DB/repositories/notification.repository';
import { NotificationType } from '../../Utils/enums/notification.enum';
import { BadRequestException } from '../../Utils/response/error.response';
import { emitToUser } from '../../Utils/socket/socket.events';

export interface INewApplicationNotificationData {
  applicationId: string;
  jobId: string;
  companyId: string;
  applicantId: string;
  jobTitle: string;
}

export class NotificationService {
  private readonly _notificationRepo = new NotificationRepository(NotificationModel);

  createNewApplicationNotifications = async ({
    hrIds,
    data,
  }: {
    hrIds: Types.ObjectId[];
    data: INewApplicationNotificationData;
  }): Promise<void> => {
    if (!hrIds.length) {
      return;
    }

    const notifications: Partial<INotification>[] = hrIds.map((hrId) => ({
      recipientId: hrId,

      senderId: new Types.ObjectId(data.applicantId),

      type: NotificationType.NEW_APPLICATION,

      title: 'New Job Application',

      body: `A new application has been submitted for ${data.jobTitle}`,

      data: {
        applicationId: data.applicationId,
        jobId: data.jobId,
        companyId: data.companyId,
        applicantId: data.applicantId,
      },

      isRead: false,
    }));

    const createdNotifications = await this._notificationRepo.create({
      data: notifications,
    });

    if (!createdNotifications?.length) {
      throw new BadRequestException('Failed to create notifications');
    }

    for (const notification of createdNotifications) {
      emitToUser(notification.recipientId.toString(), 'newApplication', {
        notificationId: notification._id.toString(),
        type: notification.type,
        title: notification.title,
        body: notification.body,
        data: notification.data,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      });
    }
  };
}
