import { Types } from 'mongoose';
import { ConversationModel } from '../../DB/Models/conversation.model';
import { MessageModel } from '../../DB/Models/message.model';
import { UserModel } from '../../DB/Models/user.model';
import { ConversationRepository } from '../../DB/repositories/conversation.repo';
import { MessageRepository } from '../../DB/repositories/message.repo';
import { UserRepository } from '../../DB/repositories/user.repo';
import { BadRequestException, NotFoundException } from '../../Utils/response/error.response';
import { ISendMessageServiceDTO } from './chat.dto';

export class ChatService {
  private readonly userRepo = new UserRepository(UserModel);
  private readonly conversationRepo = new ConversationRepository(ConversationModel);
  private readonly messageRepo = new MessageRepository(MessageModel);

  public async sendMessage({ senderId, receiverId, content }: ISendMessageServiceDTO) {
    if (senderId.equals(receiverId)) {
      throw new BadRequestException('You cannot send a message to yourself');
    }
    const receiver = await this.userRepo.findOne({
      filter: {
        _id: receiverId,
        friends: {
          $in: [senderId],
        },
      },
    });
    if (!receiver) {
      throw new NotFoundException('Receiver not found or is not your friend');
    }

    let conversation = await this.conversationRepo.findOne({
      filter: {
        participants: {
          $all: [senderId, receiverId],
        },
        $expr: {
          $eq: [
            {
              $size: '$participants',
            },
            2,
          ],
        },
      },
    });
    if (!conversation) {
      const [createdConversation] =
        (await this.conversationRepo.create({
          data: [
            {
              participants: [senderId, receiverId],
            },
          ],
        })) || [];

      if (!createdConversation) {
        throw new BadRequestException('Failed to create conversation');
      }
      conversation = createdConversation;
    }

    const [message] =
      (await this.messageRepo.create({
        data: [
          {
            conversationId: conversation._id,
            senderId,
            recieverId: receiverId,
            content: content.trim(),
          },
        ],
      })) || [];

    if (!message) {
      throw new BadRequestException('Failed to create message');
    }

    await this.conversationRepo.findOneAndUpdate({
      filter: {
        _id: conversation._id,
      },
      update: {
        $set: {
          lastMessage: message.content,
          lastMessageAt: message.createdAt,
          lastMessageBy: senderId,
        },
      },
    });

    const populatedMessage = await this.messageRepo.findOne({
      filter: {
        _id: message._id,
      },

      options: {
        populate: [
          {
            path: 'senderId',
            select: 'firstName lastName username profilePic',
          },
          {
            path: 'recieverId',
            select: 'firstName lastName username profilePic',
          },
        ],
      },
    });

    return {
      conversation,
      message: populatedMessage ?? message,
      receiverId,
      senderId,
    };
  }

  public async getChat(
    userId: Types.ObjectId,
    friendId: Types.ObjectId,
    page: number,
    limit: number,
  ) {
    const conversation = await this.conversationRepo.findOne({
      filter: {
        participants: {
          $all: [userId, friendId],
        },
        $expr: {
          $eq: [{ $size: '$participants' }, 2],
        },
      },
    });

    if (!conversation) {
      return {
        conversation: null,
        messages: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      };
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.messageRepo.find({
        filter: {
          conversationId: conversation._id,
        },

        options: {
          sort: {
            createdAt: 1,
          },

          skip,
          limit,

          populate: [
            {
              path: 'senderId',
              select: 'firstName lastName username profilePic',
            },
          ],
        },
      }),

      this.messageRepo.countDocuments({
        filter: {
          conversationId: conversation._id,
        },
      }),
    ]);

    return {
      conversation,
      messages,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  public async markAsRead(userId: Types.ObjectId, senderId: Types.ObjectId) {
    if (userId.equals(senderId)) {
      throw new BadRequestException('You cannot mark your own messages as read');
    }

    const conversation = await this.conversationRepo.findOne({
      filter: {
        participants: {
          $all: [userId, senderId],
        },
        $expr: {
          $eq: [
            {
              $size: '$participants',
            },
            2,
          ],
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const result = await this.messageRepo.updateMany({
      filter: {
        conversationId: conversation._id,
        senderId: senderId,
        recieverId: userId,
        readAt: null,
      },
      update: {
        $set: {
          readAt: new Date(),
        },
      },
    });

    return {
      conversation,
      count: result.modifiedCount,
      by: userId,
      senderId,
    };
  }
}
