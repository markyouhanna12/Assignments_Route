import { Provider } from '../../Utils/enums/provider.enum';
import { Gender } from '../../Utils/enums/gender.enum';
import { Role } from '../../Utils/enums/role.enum';
import { OTPType } from '../../Utils/enums/otp-type.enum';
import { HydratedDocument, model, Schema, Types } from 'mongoose';
import { genrateHash } from '../../Utils/security/hash.security';
import { decryptSync, encrypt } from '../../Utils/security/encryption.security';

export interface IProfilePicture {
  secure_url: string;
  public_id: string;
}

export interface IOTP {
  code: string;
  type: OTPType;
  expiresIn: Date;
}

export interface IUser {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  password: string;
  provider: Provider;
  gender: Gender;
  dob: Date;
  mobileNumber: string;
  role: Role;
  isConfirmed: boolean;
  deletedAt?: Date;
  bannedAt?: Date;
  updatedBy?: Types.ObjectId;
  changeCredentialTime?: Date;
  profilePic?: IProfilePicture;
  coverPic?: IProfilePicture;
  otp?: IOTP[];

  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = HydratedDocument<IUser>;

const profilePictureSchema = new Schema<IProfilePicture>(
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

const otpSchema = new Schema<IOTP>(
  {
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(OTPType),
      required: true,
    },
    expiresIn: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function (this: IUserDocument): boolean {
        return this.provider === Provider.SYSTEM;
      },
      minlength: 8,
    },

    provider: {
      type: String,
      enum: Object.values(Provider),
      default: Provider.SYSTEM,
      required: true,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
      required: true,
    },

    isConfirmed: {
      type: Boolean,
      default: false,
      required: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    bannedAt: {
      type: Date,
      default: null,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    changeCredentialTime: {
      type: Date,
      default: null,
    },

    profilePic: {
      type: profilePictureSchema,
    },

    coverPic: {
      type: profilePictureSchema,
    },

    otp: {
      type: [otpSchema],
      default: [],
    },
    providerId: {
      type: String,
      sparse: true,
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

userSchema.virtual('username').get(function (this: HydratedDocument<IUser>) {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.index(
  { providerId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      provider: Provider.GOOGLE,
      providerId: {
        $exists: true,
      },
    },
  },
);

userSchema.pre('save', async function (this: IUserDocument): Promise<void> {
  if (this.isModified('password') && this.password) {
    this.password = await genrateHash(this.password);
  }

  if (this.isModified('mobileNumber') && this.mobileNumber) {
    this.mobileNumber = await encrypt(this.mobileNumber);
  }
});

// Decrypts mobileNumber on any doc(s) about to be returned from a query.
// Works for single docs, arrays (from `find`), and lean objects.
function decryptMobileNumberOnDoc(doc: any): void {
  if (!doc) return;

  if (Array.isArray(doc)) {
    doc.forEach(decryptMobileNumberOnDoc);
    return;
  }

  if (doc.mobileNumber) {
    try {
      doc.mobileNumber = decryptSync(doc.mobileNumber);
    } catch {
      // already plaintext / not encrypted yet — leave as-is
    }
  }
}

userSchema.post(['find', 'findOne', 'findOneAndUpdate'], function (result) {
  decryptMobileNumberOnDoc(result);
});

export const UserModel = model<IUser>('User', userSchema);
