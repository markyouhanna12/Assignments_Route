import mongoose, { HydratedDocument, Model, model, Schema, Types } from 'mongoose';

export interface IConversation {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage?: string;
  lastMessageAt?: Date;
  lastMessageBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
    },
    lastMessageBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ConversationModel: Model<IConversation> = model<IConversation>(
  'Conversation',
  conversationSchema,
);

export type HConversationDocument = HydratedDocument<IConversation>;
