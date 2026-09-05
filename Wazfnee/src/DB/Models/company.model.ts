import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';
import { CompanySize } from '../../Utils/enums/company.enum';

export interface ICompanyFile {
  secure_url: string;
  public_id: string;
}

export interface ICompany {
  companyName: string;
  description: string;
  industry: string;
  address: string;
  numberOfEmployees: CompanySize;
  companyEmail: string;

  createdBy: Types.ObjectId;

  logo?: ICompanyFile;
  coverPic?: ICompanyFile;

  hrs: Types.ObjectId[];

  bannedAt?: Date;
  deletedAt?: Date;

  legalAttachment?: ICompanyFile;

  approvedByAdmin: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type ICompanyDocument = HydratedDocument<ICompany>;

const companyFileSchema = new Schema<ICompanyFile>(
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

const companySchema = new Schema<ICompany>(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    numberOfEmployees: {
      type: String,
      required: true,
      enum: Object.values(CompanySize),
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    logo: {
      type: companyFileSchema,
    },
    coverPic: {
      type: companyFileSchema,
    },

    hrs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    bannedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },

    legalAttachment: {
      type: companyFileSchema,
    },

    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const CompanyModel: Model<ICompany> = model<ICompany>('Company', companySchema);
