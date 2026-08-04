import { Request, Response } from 'express';
import { ICreatePostDTO } from './post.dto';
import { BadRequestException } from '../../Utils/response/error.response';
import { PostRepository } from '../../DB/repositories/post.repo';
import { PostModel } from '../../DB/Models/post.model';
import { file } from 'zod';
import { successResponse } from '../../Utils/response/success.response';

class PostService {
  private _postRepo = new PostRepository(PostModel);

  constructor() {}

  createPost = async (req: Request, res: Response): Promise<Response> => {
    const { content }: ICreatePostDTO = req.body;

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
}

export default new PostService();
