import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '../../DB/repositories/user.repo';
import { HUserDocument, UserModel } from '../../DB/Models/user.model';
import { RoleEnum, SignatureEnum, TokenTypeEnum } from '../enums/auth.enum';
import {
  ACCESS_EXPIRES,
  REFRESH_EXPIRES,
  TOKEN_ACCESS_ADMIN_SECRET_KEY,
  TOKEN_ACCESS_USER_SECRET_KEY,
  TOKEN_REFRESH_ADMIN_SECRET_KEY,
  TOKEN_REFRESH_USER_SECRET_KEY,
} from '../../config/config.service';
import { v4 as uuid } from 'uuid';
import { BadRequestException, NotFoundException } from '../response/error.response';

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  jti: string;
}

export class TokenService {
  private readonly _userRepo = new UserRepository(UserModel);

  constructor() {}

  sign = async (paylaod: object, secret: string, options?: jwt.SignOptions): Promise<string> => {
    return jwt.sign(paylaod, secret, options);
  };

  verify = async (token: string, secret: string): Promise<CustomJwtPayload> => {
    return jwt.verify(token, secret) as CustomJwtPayload;
  };

  getSignature = ({ SignatureLevel = SignatureEnum.USER }) => {
    let signature: { accessSignature: string; refreshSignature: string } = {
      accessSignature: '',
      refreshSignature: '',
    };
    switch (SignatureLevel) {
      case SignatureEnum.ADMIN:
        ((signature.accessSignature = TOKEN_ACCESS_ADMIN_SECRET_KEY as string),
          (signature.refreshSignature = TOKEN_REFRESH_ADMIN_SECRET_KEY as string));
        break;
      case SignatureEnum.USER:
        signature.accessSignature = TOKEN_ACCESS_USER_SECRET_KEY as string;
        signature.refreshSignature = TOKEN_REFRESH_USER_SECRET_KEY as string;
        break;

      default:
        signature.accessSignature = TOKEN_ACCESS_USER_SECRET_KEY as string;
        signature.refreshSignature = TOKEN_REFRESH_USER_SECRET_KEY as string;
    }
    return signature;
  };

  getNewLoginCredentials = async (user: { _id: string; role: RoleEnum }) => {
    const signature = await this.getSignature({
      SignatureLevel: user.role != RoleEnum.ADMIN ? SignatureEnum.USER : SignatureEnum.ADMIN,
    });
    const jwtid = uuid();
    const accessToken = await this.sign({ id: user._id, jti: jwtid }, signature.accessSignature, {
      expiresIn: Number(ACCESS_EXPIRES),
    });

    const refreshToken = await this.sign({ id: user._id, jti: jwtid }, signature.refreshSignature, {
      expiresIn: Number(REFRESH_EXPIRES),
    });

    return { accessToken, refreshToken };
  };

  decodedToken = async ({
    authorization,
    tokenType = TokenTypeEnum.ACCESS,
  }: {
    authorization: string;
    tokenType?: TokenTypeEnum;
  }): Promise<{ user: HUserDocument; decoded: CustomJwtPayload }> => {
    if (!authorization) {
      throw new BadRequestException('Authorization Header is missing');
    }
    const [Bearer, token] = authorization.split(' ') || [];
    if (!Bearer || !token) {
      throw new BadRequestException('Invalid Token Format');
    }
    let signature = await this.getSignature({
      SignatureLevel: Bearer === 'Admin' ? SignatureEnum.ADMIN : SignatureEnum.USER,
    });

    const secret =
      tokenType === TokenTypeEnum.ACCESS ? signature.accessSignature : signature.refreshSignature;

    const decoded = await this.verify(token, secret);

    const user = await this._userRepo.findById({ id: decoded.id });
    if (!user) {
      throw new NotFoundException('Not Registered Account');
    }

    return { decoded, user };
  };
}
