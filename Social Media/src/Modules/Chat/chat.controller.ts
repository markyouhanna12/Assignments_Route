import e, { Request, Response } from 'express';
import { Types } from 'mongoose';

import { ChatService } from './chat.service';
import { successResponse } from '../../Utils/response/success.response';

export class ChatController {
  private readonly chatService = new ChatService();

  getChat = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.chatService.getChat(
      req.user._id,
      new Types.ObjectId(req.params.userId),
      Number(req.query.page),
      Number(req.query.limit),
    );

    return successResponse({
      res,
      message: 'Chat fetched successfully',
      statusCode: 200,
      data: result,
    });
  };
}
