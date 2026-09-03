import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import {
  ACCESS_EXPIRES,
  REFRESH_EXPIRES,
  TOKEN_ACCESS_ADMIN_SECRET_KEY,
  TOKEN_ACCESS_USER_SECRET_KEY,
  TOKEN_REFRESH_ADMIN_SECRET_KEY,
  TOKEN_REFRESH_USER_SECRET_KEY,
} from '../../Config/config.service';
import { UserRepository } from '../../DB/repositories/user.repository';
import { IUserDocument, UserModel } from '../../DB/Models/user.model';
import { Signature, TokenType } from '../enums/auth.enum';
import { Role } from '../enums/role.enum';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../response/error.response';

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  jti: string;
}

export class TokenService {
  private readonly userRepository = new UserRepository(UserModel);

  constructor() {}

  sign = async (payload: object, secret: string, options?: SignOptions): Promise<string> => {
    return jwt.sign(payload, secret, options);
  };

  verify = async (token: string, secret: string): Promise<CustomJwtPayload> => {
    return jwt.verify(token, secret) as CustomJwtPayload;
  };

  getSignature = (
    signatureLevel: Signature = Signature.USER,
  ): {
    accessSignature: string;
    refreshSignature: string;
  } => {
    if (signatureLevel === Signature.ADMIN) {
      return {
        accessSignature: TOKEN_ACCESS_ADMIN_SECRET_KEY,
        refreshSignature: TOKEN_REFRESH_ADMIN_SECRET_KEY,
      };
    }

    return {
      accessSignature: TOKEN_ACCESS_USER_SECRET_KEY,
      refreshSignature: TOKEN_REFRESH_USER_SECRET_KEY,
    };
  };

  getNewLoginCredentials = async (user: { _id: string; role: Role }) => {
    const signature = this.getSignature(
      user.role === Role.ADMIN ? Signature.ADMIN : Signature.USER,
    );
    const jti = uuid();

    const accessToken = await this.sign(
      {
        id: user._id,
        jti,
      },
      signature.accessSignature,
      {
        expiresIn: Number(ACCESS_EXPIRES),
      },
    );

    const refreshToken = await this.sign(
      {
        id: user._id,
        jti,
      },
      signature.refreshSignature,
      {
        expiresIn: Number(REFRESH_EXPIRES),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  };

  decodedToken = async ({
    authorization,
    tokenType = TokenType.ACCESS,
  }: {
    authorization: string;
    tokenType?: TokenType;
  }): Promise<{
    user: IUserDocument;
    decoded: CustomJwtPayload;
  }> => {
    if (!authorization) {
      throw new BadRequestException('Authorization header is missing');
    }
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new BadRequestException('Invalid token format');
    }

    const decodedWithoutVerification = jwt.decode(token) as CustomJwtPayload | null;

    if (!decodedWithoutVerification?.id) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository.findById({
      id: decodedWithoutVerification.id,
    });

    if (!user) {
      throw new NotFoundException('Not Registered Account');
    }

    const signature = this.getSignature(
      user.role === Role.ADMIN ? Signature.ADMIN : Signature.USER,
    );

    const secret =
      tokenType === TokenType.ACCESS ? signature.accessSignature : signature.refreshSignature;

    const decoded = await this.verify(token, secret);

    if (!decoded.id || decoded.id !== user._id.toString()) {
      throw new UnauthorizedException('Invalid token');
    }

    if (
      user.changeCredentialTime &&
      decoded.iat &&
      user.changeCredentialTime.getTime() > decoded.iat * 1000
    ) {
      throw new UnauthorizedException('Token expired because credentials were changed');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Account has been deleted');
    }

    if (user.bannedAt) {
      throw new UnauthorizedException('Account has been banned');
    }

    return {
      user,
      decoded,
    };
  };
}
