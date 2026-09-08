import { HydratedDocument, Model, model, Schema, Types } from 'mongoose';

export enum DevicePlatform {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios',
}

export interface IFirebaseDevice {
  userId: Types.ObjectId;
  fid: string;
  platform: DevicePlatform;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IFirebaseDeviceDocument = HydratedDocument<IFirebaseDevice>;

const firebaseDeviceSchema = new Schema<IFirebaseDevice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    fid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    platform: {
      type: String,
      enum: Object.values(DevicePlatform),
      required: true,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

firebaseDeviceSchema.index({
  userId: 1,
  platform: 1,
});

export const FirebaseDeviceModel: Model<IFirebaseDevice> = model<IFirebaseDevice>(
  'FirebaseDevice',
  firebaseDeviceSchema,
);
