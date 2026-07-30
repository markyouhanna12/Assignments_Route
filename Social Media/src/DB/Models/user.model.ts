import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum } from '../../Utils/enums/auth.enum';

export interface IUser {
  firstName: string;
  lastName: string;
  username?: string;

  email: string;
  confirmEmailOTP?: string;
  confirmEmailAt?: Date;

  password: string;
  resetPasswordOTP?: string;

  phone: string;
  address?: string;

  gender?: GenderEnum;
  role?: RoleEnum;

  createdAt: Date;
  updatedAt?: Date;

  changeCredentialsTime?: Date;

  provider?: string;

  profilePic?: string;

  friends?: Types.ObjectId[];
}

export const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    confirmEmailOTP: {
      type: String,
    },
    confirmEmailAt: {
      type: Date,
    },
    password: {
      type: String,
      required: function (): boolean {
        return this.provider === ProviderEnum.System;
      },
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },
    profilePic: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual('username')
  .set(function (value: string) {
    const [firstName, lastName] = value.split(' ') || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const UserModel = mongoose.model<IUser>('User', userSchema);

export type HUserDocument = HydratedDocument<IUser>;
