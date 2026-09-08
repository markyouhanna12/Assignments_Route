import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

import { NotificationType } from '../../Utils/enums/notification.enum';

export interface INotificationData {
  [key: string]: string;
}

export interface INotification {
  recipientId: Types.ObjectId;
  senderId?: Types.ObjectId;

  type: NotificationType;

  title: string;
  body: string;

  data?: INotificationData;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type INotificationDocument = HydratedDocument<INotification>;

const notificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },

    data: {
      type: Schema.Types.Mixed,
    },

    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipientId: 1,
  createdAt: -1,
});

export const NotificationModel: Model<INotification> = model<INotification>(
  'Notification',
  notificationSchema,
);
