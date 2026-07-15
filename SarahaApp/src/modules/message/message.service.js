import { create, find, findById } from '../../DB/database.repository.js';
import messageModel from '../../DB/models/message.model.js';
import UserModel from '../../DB/models/user.model.js';
import { NotFoundException } from '../../utils/response/error.response.js';
import { successResponse } from '../../utils/response/success.response.js';

export const sendMessage = async (req, res) => {
  const { receiverId } = req.params;
  const { content } = req.body;

  const user = await findById({
    model: UserModel,
    id: receiverId,
  });
  if (!user) {
    throw NotFoundException({ message: 'Receiver not found' });
  }

  const message = await create({
    model: messageModel,
    data: [
      {
        receiverId: user._id,
        content,
      },
    ],
  });

  if (!message) {
    throw NotFoundException({ message: 'Message not sent' });
  }

  return successResponse({
    res,
    statusCode: 201,
    message: 'Message sent successfully',
    data: { message },
  });
};

export const getMessagesAdmin = async (req, res) => {
  const messages = await find({
    model: messageModel,
  });

  return successResponse({
    res,
    statusCode: 200,
    message: 'Messages retrieved successfully',
    data: { messages },
  });
};

export const getMessages = async (req, res) => {
  const user = req.user;
  const messages = await find({
    model: messageModel,
    filter: { receiverId: user._id },
    select: 'content -_id ',
  });
  return successResponse({
    res,
    statusCode: 200,
    message: 'Messages retrieved successfully',
    data: { messages },
  });
};

export const toggleRead = async (req, res) => {
  const { messageId } = req.params;
  const recieverId = req.user._id;

  const message = await findById({
    model: messageModel,
    id: messageId,
  });

  if (!message || message.receiverId.toString() !== recieverId.toString()) {
    throw NotFoundException({ message: 'Message Not Found or Unauthorized' });
  }

  message.isRead = !message.isRead;
  await message.save();

  successResponse({
    res,
    statusCode: 201,
    message: `Message Marked as ${message.isRead ? 'read' : 'unread'}`,
    data: {
      updatedMessage: message,
    },
  });
};

export const toggleFavourite = async (req, res) => {
  const { messageId } = req.params;
  const recieverId = req.user._id;

  const message = await findById({
    model: messageModel,
    id: messageId,
  });

  if (!message || message.receiverId.toString() !== recieverId.toString()) {
    throw NotFoundException({ message: 'Message Not Found or Unauthorized' });
  }

  message.isFavorite = !message.isFavorite;
  await message.save();

  successResponse({
    res,
    statusCode: 201,
    message: `Message Marked as ${message.isFavorite ? 'favorite' : 'not favorite'}`,
    data: {
      updatedMessage: message,
    },
  });
};
