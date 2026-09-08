import { io } from './socket.server';

export const emitToUser = (userId: string, event: string, data: unknown): void => {
  io.to(`user:${userId}`).emit(event, data);
};
