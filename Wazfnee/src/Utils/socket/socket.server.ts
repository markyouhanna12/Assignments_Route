import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

import { socketAuthentication } from './socket.authentication';

export let io: Server;

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.use(async (socket, next) => {
    try {
      await socketAuthentication(socket);

      next();
    } catch (error) {
      next(new Error(error instanceof Error ? error.message : 'Socket authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user._id.toString();

    socket.join(`user:${userId}`);

    console.log(`Socket connected: ${socket.id} | User: ${userId}`);

    socket.emit('testNotification', {
      message: 'Socket.IO notification is working!',
      userId,
    });

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id} | User: ${userId} | Reason: ${reason}`);
    });
  });

  return io;
};
