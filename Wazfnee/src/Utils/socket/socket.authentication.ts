import { Socket } from 'socket.io';
import { TokenService } from '../services/token.service';

const tokenService = new TokenService();

export const socsocketAuthentication = async (socket: Socket): Promise<void> => {
  try {
    const authorization = socket.handshake.headers.authorization;

    if (!authorization) {
      throw new Error('Authorization header is required');
    }

    const { user, decoded } = await tokenService.decodedToken({
      authorization,
    });

    socket.data.user = user;
    socket.data.decoded = decoded;
  } catch (error) {
    console.log(`Socket authentication failed: ${socket.id}`);

    throw error;
  }
};
