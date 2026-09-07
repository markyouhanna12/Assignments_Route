import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

import { JobLocation, WorkingTime, SeniorityLevel } from '../../Utils/enums/job.enum';

export interface IJob {
  jobTitle: string;
  jobLocation: JobLocation;
  workingTime: WorkingTime;
  seniorityLevel: SeniorityLevel;
  jobDescription: string;

  technicalSkills: string[];
  softSkills: string[];

  addedBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  closed: boolean;

  companyId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export type IJobDocument = HydratedDocument<IJob>;

const jobSchema = new Schema<IJob>(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    jobLocation: {
      type: String,
      enum: Object.values(JobLocation),
      required: true,
    },

    workingTime: {
      type: String,
      enum: Object.values(WorkingTime),
      required: true,
    },

    seniorityLevel: {
      type: String,
      enum: Object.values(SeniorityLevel),
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },

    technicalSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    softSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    closed: {
      type: Boolean,
      default: false,
      required: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
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

jobSchema.index({ companyId: 1 });

jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'jobId',
});

export const JobModel: Model<IJob> = model<IJob>('Job', jobSchema);
