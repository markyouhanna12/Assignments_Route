import { Request, Response } from 'express';
import { CommentModel, IComment } from '../../DB/Models/comment.model';
import { PostModel } from '../../DB/Models/post.model';
import { UserModel } from '../../DB/Models/user.model';
import { CommentRepository } from '../../DB/repositories/comment.repo';
import { PostRepository } from '../../DB/repositories/post.repo';
import { UserRepository } from '../../DB/repositories/user.repo';
import { successResponse } from '../../Utils/response/success.response';
import { getAvailability } from '../Post/post.service';
import { ForbiddenException, NotFoundException } from '../../Utils/response/error.response';
import { Types, UpdateQuery } from 'mongoose';
import {
  CreateCommentBodyDTO,
  CreateCommentParamsDTO,
  ReplyCommentBodyDTO,
  ReplyCommentParamsDTO,
  UpdateCommentBodyDTO,
  UpdateCommentParamsDTO,
} from './comment.dto';
import { RoleEnum } from '../../Utils/enums/auth.enum';

class CommentService {
  private readonly _userRepo = new UserRepository(UserModel);
  private readonly _postRepo = new PostRepository(PostModel);
  private readonly _commentRepo = new CommentRepository(CommentModel);

  constructor() {}

  createComment = async (
    req: Request<CreateCommentParamsDTO, {}, CreateCommentBodyDTO>,
    res: Response,
  ): Promise<Response> => {
    const { postId } = req.params;
    const { content, tags = [] } = req.body;

    const post = await this._postRepo.findOne({
      filter: {
        _id: postId,
        $or: getAvailability(req.user),
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let mentionedUsers: Types.ObjectId[] = [];

    if (tags.length) {
      const users = await this._userRepo.find({
        filter: {
          _id: { $in: tags },
        },
      });

      if (users.length !== tags.length) {
        throw new NotFoundException('Some mentioned users do not exist');
      }

      mentionedUsers = tags.map((id) => new Types.ObjectId(id));
    }

    const [comment] =
      (await this._commentRepo.create({
        data: [
          {
            content,
            postId: post._id,
            createdBy: req.user._id,
            tags: mentionedUsers,
          },
        ],
      })) || [];

    return successResponse({
      res,
      statusCode: 201,
      message: 'Comment created successfully',
      data: comment,
    });
  };

  createReply = async (
    req: Request<ReplyCommentParamsDTO, {}, ReplyCommentBodyDTO>,
    res: Response,
  ): Promise<Response> => {
    const { postId, commentId } = req.params;
    const { content, tags = [] } = req.body;

    const postObjectId = new Types.ObjectId(postId);
    const commentObjectId = new Types.ObjectId(commentId);

    const comment = await this._commentRepo.findOne({
      filter: {
        _id: commentId,
        postId,
      },
      options: {
        populate: [
          {
            path: 'postId',
            match: {
              $or: getAvailability(req.user),
            },
          },
        ],
      },
    });

    if (!comment || !comment.postId) {
      throw new NotFoundException('Comment not found');
    }

    let mentionedUsers: Types.ObjectId[] = [];

    if (tags.length) {
      const users = await this._userRepo.find({
        filter: {
          _id: { $in: tags },
        },
      });

      if (users.length !== tags.length) {
        throw new NotFoundException('Some mentioned users do not exist');
      }

      mentionedUsers = tags.map((id) => new Types.ObjectId(id));
    }

    const [reply] =
      (await this._commentRepo.create({
        data: [
          {
            content,
            createdBy: req.user._id,
            postId: postObjectId,
            commentId: commentObjectId,
            tags: mentionedUsers,
          },
        ],
      })) || [];

    return successResponse({
      res,
      statusCode: 201,
      message: 'Reply created successfully',
      data: reply,
    });
  };

  updateComment = async (
    req: Request<UpdateCommentParamsDTO, {}, UpdateCommentBodyDTO>,
    res: Response,
  ): Promise<Response> => {
    const { postId, commentId } = req.params;
    const { content, tags = [] } = req.body;

    const comment = await this._commentRepo.findOne({
      filter: {
        _id: commentId,
        postId,
        deletedAt: { $exists: false },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (
      req.user.role !== RoleEnum.ADMIN &&
      comment.createdBy.toString() !== req.user._id.toString()
    ) {
      throw new ForbiddenException('You are not allowed to update this comment');
    }

    let mentionedUsers: Types.ObjectId[] = [];

    if (tags.length) {
      const users = await this._userRepo.find({
        filter: {
          _id: { $in: tags },
        },
      });

      if (users.length !== tags.length) {
        throw new NotFoundException('Some mentioned users do not exist');
      }

      mentionedUsers = tags.map((id) => new Types.ObjectId(id));
    }

    const payload: UpdateQuery<IComment> = {
      updatedBy: req.user._id,
    };
    if (content !== undefined) {
      payload.content = content;
    }
    if (tags.length) {
      payload.tags = mentionedUsers;
    }

    const updatedComment = await this._commentRepo.findOneAndUpdate({
      filter: {
        _id: commentId,
        postId,
      },
      update: payload,
    });

    return successResponse({
      res,
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  };
}

export default new CommentService();
