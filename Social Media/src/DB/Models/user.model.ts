import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum } from '../../Utils/enums/auth.enum';
import { genrateHash } from '../../Utils/security/hash';
import { encrypt } from '../../Utils/security/encryption';
import { emailEvents } from '../../Utils/events/email.event';
import { generateOTP } from '../../Utils/generateOTP';

export interface IUser {
  firstName: string;
  lastName: string;
  username?: string;

  email: string;
  confirmEmailOTP?: string;
  confirmEmailAt?: Date;

  password: string;

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

  blockedUsers?: Types.ObjectId[];

  deviceTokens?: string[];

  notficationEnabled?: boolean;
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
    changeCredentialsTime: {
      type: Date,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    deviceTokens: [
      {
        type: String,
      },
    ],
    notficationEnabled: {
      type: Boolean,
      default: true,
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

userSchema.pre('validate', function () {
  this.email = this.email.toLowerCase().trim();
});

userSchema.pre('save', async function (this: HUserDocument & { wasNew: boolean }) {
  // logic of middleware
  this.wasNew = this.isNew;
  if (this.isModified('password')) {
    this.password = await genrateHash(this.password);
  }

  if (this.isModified('phone')) {
    this.phone = await encrypt(this.phone);
  }
});

userSchema.post('save', async function () {
  const that = this as HUserDocument & { wasNew: boolean };
  if (that.wasNew) {
    await emailEvents.emit('confirmEmail', {
      to: this.email,
      username: this.username,
      otp: generateOTP(),
    });
  }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);

export type HUserDocument = HydratedDocument<IUser>;
