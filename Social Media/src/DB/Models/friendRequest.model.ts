import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';

export interface IFriendRequest {
  sendBy: Types.ObjectId;

  sendTo: Types.ObjectId;

  acceptedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export const friendSchema = new Schema<IFriendRequest>(
  {
    sendBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    sendTo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    acceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const FriendModel = mongoose.model<IFriendRequest>('Friend', friendSchema);

export type HFriendDocument = HydratedDocument<IFriendRequest>;
