import { model, Schema, Types } from 'mongoose';
import { IPost } from './post.model';
import { IUser } from './user.model';

export interface IComment {
  content?: string | undefined;
  attachments?: string[];

  likes?: Types.ObjectId[] | IUser[];
  tags?: Types.ObjectId[] | string[];

  commentId: Types.ObjectId;

  postId: Types.ObjectId | IPost;

  createdBy: Types.ObjectId | IUser;
  updatedBy?: Types.ObjectId | IUser;

  deletedAt?: Date;
  restoredAt?: Date;

  createdAt: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: function (this) {
        return !this.attachments?.length;
      },
    },
    attachments: {
      type: [String],
      default: [],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    postId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],

    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: {
      type: Date,
    },
    restoredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

export const CommentModel = model<IComment>('Comment', commentSchema);
