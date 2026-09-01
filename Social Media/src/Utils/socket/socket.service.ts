import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

import { SOCKET_ROOMS } from './socket.constants';
import {
  AppSocket,
  ClientToServerEvents,
  InterServerEvents,
  ISocketData,
  ISocketUser,
  ServerToClientEvents,
} from './socket.types';

interface SocketServiceOptions {
  corsOrigin: string | string[];
  authenticate: (token: string) => Promise<ISocketUser>;

  getFriendIds: (userId: string) => Promise<string[]>;
}

export class SocketService {
  private io!: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, ISocketData>;

  private readonly userSockets = new Map<string, Set<string>>();

  constructor(private readonly options: SocketServiceOptions) {}

  public initialize(httpServer: HttpServer): Server {
    this.io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      ISocketData
    >(httpServer, {
      cors: {
        origin: this.options.corsOrigin,
        credentials: true,
      },
    });

    this.registerMiddleware();
    this.registerConnectionHandler();

    return this.io;
  }

  private registerMiddleware(): void {
    this.io.use(async (socket, next) => {
      try {
        const rawToken = socket.handshake.auth?.['token'];

        if (!rawToken) {
          return next(new Error('Authentication token is required'));
        }

        const token = this.extractToken(rawToken);
        const user = await this.options.authenticate(token);

        if (!user?.userId) {
          return next(new Error('Invalid authentication token'));
        }

        socket.data.user = user;
        next();
      } catch (error) {
        next(new Error(error instanceof Error ? error.message : 'Socket authentication failed'));
      }
    });
  }

  private registerConnectionHandler(): void {
    this.io.on('connection', (socket) => {
      void this.handleConnection(socket);
    });
  }

  private async handleConnection(socket: AppSocket): Promise<void> {
    const { userId } = socket.data.user;

    const wasOnline = this.isUserOnline(userId);

    this.addSocket(userId, socket.id);
    socket.join(SOCKET_ROOMS.user(userId));
    await this.sendOnlineFriends(socket);

    if (!wasOnline) {
      await this.broadcastUserOnline(socket);
    }

    socket.on('disconnect', (reason) => {
      void this.handleDisconnect(socket, reason);
    });
  }

  private async handleDisconnect(socket: AppSocket, _reason: string): Promise<void> {
    const { userId } = socket.data.user;

    this.removeSocket(userId, socket.id);

    if (this.isUserOnline(userId)) {
      return;
    }

    await this.broadcastUserOffline(socket);
  }

  private addSocket(userId: string, socketId: string): void {
    let sockets = this.userSockets.get(userId);

    if (!sockets) {
      sockets = new Set<string>();
      this.userSockets.set(userId, sockets);
    }

    sockets.add(socketId);
  }

  private removeSocket(userId: string, socketId: string): void {
    const sockets = this.userSockets.get(userId);

    if (!sockets) {
      return;
    }

    sockets.delete(socketId);

    if (sockets.size === 0) {
      this.userSockets.delete(userId);
    }
  }

  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  public getUserSockets(userId: string): string[] {
    return Array.from(this.userSockets.get(userId) ?? []);
  }

  public getOnlineUserIds(): string[] {
    return Array.from(this.userSockets.keys());
  }

  public emitToUser<T extends keyof ServerToClientEvents>(
    userId: string,
    event: T,
    ...args: Parameters<ServerToClientEvents[T]>
  ): void {
    this.io.to(SOCKET_ROOMS.user(userId)).emit(event, ...args);
  }

  public async joinConversation(socketId: string, conversationId: string): Promise<void> {
    const socket = this.io.sockets.sockets.get(socketId);

    if (!socket) {
      return;
    }

    await socket.join(SOCKET_ROOMS.conversation(conversationId));
  }

  public async leaveConversation(socketId: string, conversationId: string): Promise<void> {
    const socket = this.io.sockets.sockets.get(socketId);

    if (!socket) {
      return;
    }
    await socket.leave(SOCKET_ROOMS.conversation(conversationId));
  }

  public emitToConversation<T extends keyof ServerToClientEvents>(
    conversationId: string,
    event: T,
    ...args: Parameters<ServerToClientEvents[T]>
  ): void {
    this.io.to(SOCKET_ROOMS.conversation(conversationId)).emit(event, ...args);
  }

  public getIO(): Server {
    if (!this.io) {
      throw new Error('SocketService has not been initialized');
    }

    return this.io;
  }

  private extractToken(value: string): string {
    if (value.startsWith('Bearer ')) {
      return value.substring(7);
    }

    return value;
  }

  private async sendOnlineFriends(socket: AppSocket): Promise<void> {
    const { userId } = socket.data.user;

    const friendIds = await this.options.getFriendIds(userId);

    const onlineFriends = friendIds.filter((friendId) => this.isUserOnline(friendId));

    socket.emit('onlineFriends', {
      friends: onlineFriends,
    });
  }

  private async broadcastUserOnline(socket: AppSocket): Promise<void> {
    const { userId, firstName } = socket.data.user as any;

    const friendIds = await this.options.getFriendIds(userId);

    for (const friendId of friendIds) {
      if (!this.isUserOnline(friendId)) {
        continue;
      }

      this.emitToUser(friendId, 'userOnline', {
        userId,
        firstName,
      });
    }
  }

  private async broadcastUserOffline(socket: AppSocket): Promise<void> {
    const { userId } = socket.data.user;

    const friendIds = await this.options.getFriendIds(userId);

    for (const friendId of friendIds) {
      if (!this.isUserOnline(friendId)) {
        continue;
      }

      this.emitToUser(friendId, 'userOffline', {
        userId,
      });
    }
  }
}
