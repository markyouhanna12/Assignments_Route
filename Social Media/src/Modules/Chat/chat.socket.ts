import { Types } from 'mongoose';
import { SocketService } from '../../Utils/socket/socket.service';
import { AppSocket } from '../../Utils/socket/socket.types';
import { ChatService } from './chat.service';
import { markAsReadSchema, sendMessageSchema } from './chat.validation';
import { ZodError } from 'zod';

export class ChatSocket {
  private readonly chatService = new ChatService();

  constructor(private readonly socketService: SocketService) {}

  public register(socket: AppSocket): void {
    this.registerSendMessage(socket);
    this.registerMarkAsRead(socket);
  }

  private registerSendMessage(socket: AppSocket): void {
    socket.on('sendMessage', async (payload) => {
      try {
        const { to, content } = sendMessageSchema.body.parse(payload);
        const result = await this.chatService.sendMessage({
          senderId: new Types.ObjectId(socket.data.user.userId),
          receiverId: new Types.ObjectId(to),
          content,
        });

        this.socketService.emitToUser(
          result.receiverId.toString(),
          'newMessage',
          this.toSocketMessage(result.message, result.receiverId),
        );
      } catch (error) {
        const message =
          error instanceof ZodError
            ? error.issues.map((issue) => issue.message).join(', ')
            : error instanceof Error
              ? error.message
              : 'Failed to send message';

        socket.emit('socketError', {
          event: 'sendMessage',
          error: message,
        });
      }
    });
  }

  private toSocketMessage(message: any, receiverId: Types.ObjectId) {
    const sender = message.senderId;

    return {
      _id: message._id,
      conversationId: message.conversationId,
      sender: {
        _id: sender?._id,
        firstName: sender?.firstName,
        lastName: sender?.lastName,
      },
      senderId: sender?._id ?? message.senderId,
      receiverId: receiverId.toString(),

      content: message.content,

      createdAt: message.createdAt,

      readAt: message.readAt ?? null,

      delivered: true,
    };
  }

  private registerMarkAsRead(socket: AppSocket): void {
    socket.on('markAsRead', async (payload) => {
      try {
        const { from } = markAsReadSchema.body.parse(payload);

        const readerId = new Types.ObjectId(socket.data.user.userId);

        const senderId = new Types.ObjectId(from);

        const result = await this.chatService.markAsRead(readerId, senderId);

        if (result.count === 0) {
          return;
        }

        this.socketService.emitToUser(from, 'messagesRead', {
          by: readerId.toString(),

          count: result.count,
        });
      } catch (error) {
        const message =
          error instanceof ZodError
            ? error.issues.map((issue) => issue.message).join(', ')
            : error instanceof Error
              ? error.message
              : 'Failed to mark messages as read';

        socket.emit('socketError', {
          event: 'markAsRead',
          error: message,
        });
      }
    });
  }
}
