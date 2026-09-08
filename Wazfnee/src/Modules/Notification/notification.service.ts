import { Types } from 'mongoose';
import { INotification, NotificationModel } from '../../DB/Models/notification.model';
import { NotificationRepository } from '../../DB/repositories/notification.repository';
import { NotificationType } from '../../Utils/enums/notification.enum';
import { BadRequestException } from '../../Utils/response/error.response';
import { emitToUser } from '../../Utils/socket/socket.events';
import { FirebaseDeviceRepository } from '../../DB/repositories/firebase-device.repository';
import { DevicePlatform, FirebaseDeviceModel } from '../../DB/Models/firebase-device.model';
import { sendPushNotificationToMultipleDevices } from '../../Utils/notification/push.notification';

export interface INewApplicationNotificationData {
  applicationId: string;
  jobId: string;
  companyId: string;
  applicantId: string;
  jobTitle: string;
}

export class NotificationService {
  private readonly _notificationRepo = new NotificationRepository(NotificationModel);
  private readonly _firebaseDeviceRepo = new FirebaseDeviceRepository(FirebaseDeviceModel);

  createNewApplicationNotifications = async ({
    hrIds,
    data,
  }: {
    hrIds: Types.ObjectId[];
    data: INewApplicationNotificationData;
  }): Promise<void> => {
    if (!hrIds.length) {
      console.log('[Notification] No HRs found');
      return;
    }

    console.log(
      '[Notification] HR IDs:',
      hrIds.map((id) => id.toString()),
    );

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

    console.log(`[Notification] Created ${createdNotifications.length} notification(s)`);

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

    console.log('[Notification] Socket notifications emitted');

    const devices = await this._firebaseDeviceRepo.getDevicesByUsers({
      userIds: hrIds,
    });

    console.log('[Notification] Firebase devices:', devices);

    if (!devices.length) {
      console.log('[Notification] No Firebase devices found for HRs');
      return;
    }

    const tokens = devices.map((device) => device.token);

    console.log('[Notification] Firebase tokens count:', tokens.length);

    try {
      console.log('[Notification] Sending FCM notification...');

      await sendPushNotificationToMultipleDevices({
        tokens,
        title: 'New Job Application',
        body: `A new application has been submitted for ${data.jobTitle}`,
        data: {
          applicationId: data.applicationId,
          jobId: data.jobId,
          companyId: data.companyId,
          applicantId: data.applicantId,
        },
      });

      console.log('[Notification] FCM send completed');
    } catch (error) {
      console.error('[Notification] FCM failed:', error);
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

  registerDevice = async ({
    userId,
    token,
    platform,
  }: {
    userId: Types.ObjectId;
    token: string;
    platform: DevicePlatform;
  }) => {
    const device = await this._firebaseDeviceRepo.findOne({
      filter: {
        token,
      },
    });

    if (device) {
      const updatedDevice = await this._firebaseDeviceRepo.findByIdAndUpdate({
        id: device._id.toString(),
        update: {
          userId,
          platform,
          lastUsedAt: new Date(),
        },
        options: {
          new: true,
        },
      });

      return updatedDevice;
    }

    const createdDevice = await this._firebaseDeviceRepo.create({
      data: [
        {
          userId,
          token,
          platform,
          lastUsedAt: new Date(),
        },
      ],
    });

    return createdDevice?.[0];
  };
}
