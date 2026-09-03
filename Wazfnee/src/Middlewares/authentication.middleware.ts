import { NextFunction, Request, Response } from 'express';
import { TokenType } from '../Utils/enums/auth.enum';
import { TokenService } from '../Utils/services/token.service';
import { BadRequestException, ForbiddenException } from '../Utils/response/error.response';
import { Role } from '../Utils/enums/role.enum';

export const authentication = ({
  tokenType = TokenType.ACCESS,
}: {
  tokenType?: TokenType;
} = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const tokenService = new TokenService();

    if (!req.headers.authorization) {
      throw new BadRequestException('Authorization header is missing');
    }

    const { user, decoded } = await tokenService.decodedToken({
      authorization: req.headers.authorization,
      tokenType,
    });

    req.user = user;
    req.decoded = decoded;

    return next();
  };
};

export const authorization = ({
  accessRoles = [],
}: {
  accessRoles?: Role[];
} = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ForbiddenException('Authentication is required');
    }
    if (!accessRoles.includes(req.user.role)) {
      throw new ForbiddenException('You are not authorized to access this route');
    }

    return next();
  };
};
