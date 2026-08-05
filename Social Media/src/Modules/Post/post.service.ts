import { Request, Response } from 'express';
import { ICreatePostDTO } from './post.dto';
import { BadRequestException, NotFoundException } from '../../Utils/response/error.response';
import { PostRepository } from '../../DB/repositories/post.repo';
import { PostModel } from '../../DB/Models/post.model';
import { any, file } from 'zod';
import { successResponse } from '../../Utils/response/success.response';
import mongoose, { ObjectId } from 'mongoose';
import { AvailabitlityEnum } from '../../Utils/enums/auth.enum';
import { UserRepository } from '../../DB/repositories/user.repo';
import { HUserDocument, UserModel } from '../../DB/Models/user.model';

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

    const post = await this._postRepo.findOneAndUpdate({
      filter: {
        _id: postId as string,
        $or: getAvailability(req.user),
      },
      update: {
        ...(Number(react) > 0
          ? { $addToSet: { likes: req.user._id } }
          : { $pull: { likes: req.user._id } }),
      },
    });

    if (!post) {
      throw new NotFoundException('Fail to found matching post');
    }

    return successResponse({
      res,
      statusCode: 200,
      data: post,
    });
  };
}

export default new PostService();
