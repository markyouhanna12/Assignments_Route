import { HydratedDocument, Model, model, Schema, Types } from 'mongoose';

export interface IMessage {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;

  senderId: Types.ObjectId;
  recieverId: Types.ObjectId;

  content: string;
  readAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      minLength: 1,
      maxLength: 50000,
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recieverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});

messageSchema.index({
  recieverId: 1,
  readAt: -1,
});

messageSchema.pre('validate', async function () {
  if (this.content) {
    this.content = this.content.trim();
  }
});

export const MessageModel: Model<IMessage> = model<IMessage>('Message', messageSchema);

export type HMessageDocument = HydratedDocument<IMessage>;
