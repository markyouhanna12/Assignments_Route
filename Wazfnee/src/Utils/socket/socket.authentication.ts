import { Socket } from 'socket.io';
import { TokenService } from '../services/token.service';

const tokenService = new TokenService();

export const socketAuthentication = async (socket: Socket): Promise<void> => {
  const authToken = socket.handshake.auth['token'] as string;

  const authorization = authToken || socket.handshake.headers.authorization;

  if (!authorization) {
    throw new Error('Authorization token is required');
  }

  const normalizedAuthorization = authorization.startsWith('Bearer ')
    ? authorization
    : `Bearer ${authorization}`;

  const { user, decoded } = await tokenService.decodedToken({
    authorization: normalizedAuthorization,
  });

  socket.data.user = user;
  socket.data.decoded = decoded;
};
