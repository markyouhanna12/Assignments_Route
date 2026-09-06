import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

import { ApplicationStatus } from '../../Utils/enums/application.enum';

export interface IApplicationFile {
  secure_url: string;
  public_id: string;
}

export interface IApplication {
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  userCV: IApplicationFile;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type IApplicationDocument = HydratedDocument<IApplication>;

const applicationFileSchema = new Schema<IApplicationFile>(
  {
    secure_url: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    userCV: {
      type: applicationFileSchema,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index({
  jobId: 1,
});

applicationSchema.index({
  userId: 1,
});

export const ApplicationModel: Model<IApplication> = model<IApplication>(
  'Application',
  applicationSchema,
);
