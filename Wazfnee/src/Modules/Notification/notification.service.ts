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

  getUserNotifications = async ({
    userId,
    page = 1,
    limit = 10,
    sort = '-createdAt',
  }: {
    userId: Types.ObjectId;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      this._notificationRepo.find({
        filter: {
          recipientId: userId,
        },
        options: {
          skip,
          limit,
          sort,
        },
      }),

      this._notificationRepo.countDocuments({
        filter: {
          recipientId: userId,
        },
      }),

      this._notificationRepo.countDocuments({
        filter: {
          recipientId: userId,
          isRead: false,
        },
      }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  };

  markAsRead = async ({
    notificationId,
    userId,
  }: {
    notificationId: Types.ObjectId;
    userId: Types.ObjectId;
  }) => {
    const notification = await this._notificationRepo.findOne({
      filter: {
        _id: notificationId,
        recipientId: userId,
      },
    });

    if (!notification) {
      throw new BadRequestException('Notification not found');
    }

    if (notification.isRead) {
      return notification;
    }

    const updatedNotification = await this._notificationRepo.findByIdAndUpdate({
      id: notificationId.toString(),
      update: {
        isRead: true,
      },
      options: {
        new: true,
      },
    });

    return updatedNotification;
  };
}
