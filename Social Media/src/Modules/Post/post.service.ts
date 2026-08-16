import { Request, Response } from 'express';
import { ICreatePostDTO, IUpdatePostDTO } from './post.dto';
import { BadRequestException, NotFoundException } from '../../Utils/response/error.response';
import { PostRepository } from '../../DB/repositories/post.repo';
import { PostModel } from '../../DB/Models/post.model';
import { any, file } from 'zod';
import { successResponse } from '../../Utils/response/success.response';
import mongoose, { ObjectId, Types } from 'mongoose';
import { AvailabitlityEnum } from '../../Utils/enums/auth.enum';
import { UserRepository } from '../../DB/repositories/user.repo';
import { HUserDocument, UserModel } from '../../DB/Models/user.model';
import { notificationEvent } from '../../Utils/events/notification.event';

export const getAvailability = (user: HUserDocument) => {
  return [
    { availability: AvailabitlityEnum.PUBLIC },
    { availability: AvailabitlityEnum.ONLY_ME, createdBy: user._id },
    { tags: { $in: [user._id] } },
  ];
};

class PostService {
  private readonly _postRepo = new PostRepository(PostModel);
  private readonly _userRepo = new UserRepository(UserModel);
  private readonly activePostFilter = (postId: string, userId: string) => ({
    _id: postId,
    createdBy: userId,
    freezedAt: { $exists: false },
  });

  constructor() {}

  createPost = async (req: Request, res: Response): Promise<Response> => {
    const { content, availability, tags = [] }: ICreatePostDTO = req.body;

    const files = req.files as Express.Multer.File[] | undefined;

    if (!content && !files?.length) {
      throw new BadRequestException('Post must have content or attachments');
    }

    const post = await this._postRepo.create({
      data: [
        {
          ...(content && { content }),
          ...(files?.length && { attachments: files.map((file) => file.path) }),
          createdBy: req.user!._id,
          availability,
          tags: tags as any,
        },
      ],
    });

    return successResponse({
      res,
      statusCode: 201,
      message: 'Post Created Successfully',
      data: post,
    });
  };

  reactPost = async (req: Request, res: Response): Promise<Response> => {
    const { postId } = req.params;
    const { react } = req.query;

    const isLike = Number(react) > 0;

    const post = await this._postRepo.findOneAndUpdate({
      filter: {
        _id: postId as string,
        $or: getAvailability(req.user),
      },
      update: {
        ...(isLike ? { $addToSet: { likes: req.user._id } } : { $pull: { likes: req.user._id } }),
      },
    });

    if (!post) {
      throw new NotFoundException('Fail to found matching post');
    }

    if (isLike) {
      notificationEvent.emit('postLike', {
        to: post.createdBy,
        sender: {
          _id: req.user._id as Types.ObjectId,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
        },
        postId: post._id,
      });
    }

    return successResponse({
      res,
      statusCode: 200,
      data: post,
    });
  };

  updatePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId } = req.params;
    const { content, availability, tags }: IUpdatePostDTO = req.body;

    const files = req.files as Express.Multer.File[] | undefined;

    if (!content && !availability && !tags && (!files || files.length === 0)) {
      throw new BadRequestException('Please provide at least one field to update.');
    }
    const payload: any = {};

    if (content) payload.content = content;

    if (availability) payload.availability = availability;

    if (tags) payload.tags = tags;

    if (files?.length) {
      payload.attachments = files.map((file) => file.path);
    }
    const post = await this._postRepo.findOneAndUpdate({
      filter: this.activePostFilter(postId as any, req.user!._id.toString()),
      update: payload,
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return successResponse({
      res,
      statusCode: 200,
      message: 'Post updated successfully.',
      data: post,
    });
  };

  deletePost = async (req: Request, res: Response): Promise<Response> => {
    const { postId } = req.params;

    const post = await this._postRepo.findOneAndUpdate({
      filter: this.activePostFilter(postId as any, req.user!._id.toString()),
      update: {
        freezedAt: new Date(),
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return successResponse({
      res,
      statusCode: 200,
      message: 'Post deleted successfully.',
    });
  };

  getMyPosts = async (req: Request, res: Response): Promise<Response> => {
    const posts = await this._postRepo.find({
      filter: {
        createdBy: req.user!._id,
        freezedAt: { $exists: false },
      },
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return successResponse({
      res,
      statusCode: 200,
      data: posts,
    });
  };

  getUserPosts = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;

    let filter: any = {
      createdBy: userId,
      freezedAt: { $exists: false },
    };

    if (userId !== req.user!._id.toString()) {
      filter.availability = AvailabitlityEnum.PUBLIC;
    }

    const posts = await this._postRepo.find({
      filter,
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });
    return successResponse({
      res,
      statusCode: 200,
      data: posts,
    });
  };
}

export default new PostService();
