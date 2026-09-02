// Modules/Chat/chat.dto.ts

import { z } from 'zod';
import { getChatSchema, sendMessageSchema } from './chat.validation';
import { Types } from 'mongoose';

export type ISendMessageDTO = z.infer<typeof sendMessageSchema.body>;

export type IGetChatDTO = z.infer<typeof getChatSchema>;

export interface ISendMessageServiceDTO {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
}
