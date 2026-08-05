import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';
import { AvailabitlityEnum } from '../../Utils/enums/auth.enum';

export interface IPost {
  _id: Types.ObjectId;

  content?: string;

  attachments?: string[];

  createdBy: Types.ObjectId;

  likes?: Types.ObjectId[];

  tags?: Types.ObjectId[];

  availability?: AvailabitlityEnum;

  freezedAt?: Date;

  createdAt: Date;

  updatedAt?: Date;
}

export const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 50000,
      required: function (this: IPost) {
        return !this.attachments?.length;
      },
    },

    attachments: [
      {
        type: String,
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

    availability: {
      type: String,
      enum: AvailabitlityEnum,
      default: AvailabitlityEnum.PUBLIC,
    },

    freezedAt: {
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

postSchema.index({ createdBy: 1, createdAt: -1 });

postSchema.virtual('comments', {
  localField: '_id',
  foreignField: 'postId',
  ref: 'Comment',
});

export const PostModel: Model<IPost> = model<IPost>('Post', postSchema);
export type HPostDocument = HydratedDocument<IPost>;
