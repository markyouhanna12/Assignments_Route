import { Request, Response } from 'express';
import { IUserDocument } from '../DB/Models/user.model';
import { CustomJwtPayload, TokenService } from '../Utils/services/token.service';
import { ForbiddenException, UnauthorizedException } from '../Utils/response/error.response';
import { TokenType } from '../Utils/enums/auth.enum';
import { Role } from '../Utils/enums/role.enum';

export interface GraphQLContext {
  req: Request;
  res: Response;
  user: IUserDocument;
  decoded: CustomJwtPayload;
}

const tokenService = new TokenService();

export const createGraphQLContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext> => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new UnauthorizedException('Authorization header is missing');
  }

  const { user, decoded } = await tokenService.decodedToken({
    authorization,
    tokenType: TokenType.ACCESS,
  });

  if (user.role !== Role.ADMIN) {
    throw new ForbiddenException('Only admins can access the dashboard');
  }

  return {
    req,
    res,
    user,
    decoded,
  };
};
