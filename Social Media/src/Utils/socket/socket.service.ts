import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

import { SOCKET_ROOMS } from './socket.constants';
import {
  AppSocket,
  ClientToServerEvents,
  InterServerEvents,
  ISocketData,
  ServerToClientEvents,
} from './socket.types';
import { TokenService } from '../services/token';
import { UserModel } from '../../DB/Models/user.model';
import { TokenTypeEnum } from '../enums/auth.enum';

export class SocketService {
  private io!: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, ISocketData>;

  private readonly userSockets = new Map<string, Set<string>>();
  private readonly tokenService = new TokenService();

  constructor() {}

  public initialize(httpServer: HttpServer) {
    this.io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      ISocketData
    >(httpServer, {
      cors: {
        origin: true,
        credentials: true,
      },
    });

    this.registerAuthentication();
    this.registerConnectionHandler();

    return this.io;
  }

  private registerAuthentication(): void {
    this.io.use(async (socket, next) => {
      try {
        const authorization = socket.handshake.auth?.['token'];

        if (!authorization) {
          return next(new Error('authorization token is required'));
        }
        const result = await this.tokenService.decodedToken({
          authorization,
          tokenType: TokenTypeEnum.ACCESS,
        });

        if (!result?.user) {
          return next(new Error('invalid or expired access token'));
        }

        socket.data.user = {
          userId: result.user._id.toString(),
          firstName: result.user.firstName,
          lastName: result.user.lastName,
        };

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

    const wasAlreadyOnline = this.isUserOnline(userId);

    this.addSocket(userId, socket.id);

    await socket.join(SOCKET_ROOMS.user(userId));

    await this.sendOnlineFriends(socket);

    if (!wasAlreadyOnline) {
      await this.broadcastUserOnline(socket);
    }

    console.log(`Socket connected: ${userId} (${socket.id})`);

    socket.on('disconnect', (reason) => {
      void this.handleDisconnect(socket, reason);
    });
  }

  private async handleDisconnect(socket: AppSocket, reason: string): Promise<void> {
    const { userId } = socket.data.user;

    this.removeSocket(userId, socket.id);

    if (this.isUserOnline(userId)) {
      console.log(`Socket disconnected: ${userId} (${socket.id}) - ${reason}`);

      return;
    }

    await this.broadcastUserOffline(socket);

    console.log(`User offline: ${userId}`);
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

  private async getFriendIds(userId: string): Promise<string[]> {
    const user = await UserModel.findById(userId).select('friends').lean();

    if (!user?.friends) {
      return [];
    }

    return user.friends.map((id) => id.toString());
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

  private async sendOnlineFriends(socket: AppSocket): Promise<void> {
    const { userId } = socket.data.user;

    const friendIds = await this.getFriendIds(userId);

    const onlineFriends = friendIds.filter((friendId) => this.isUserOnline(friendId));

    socket.emit('onlineFriends', {
      friends: onlineFriends,
    });
  }

  private async broadcastUserOnline(socket: AppSocket): Promise<void> {
    const { userId, firstName } = socket.data.user as any;

    const friendIds = await this.getFriendIds(userId);

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

    const friendIds = await this.getFriendIds(userId);

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
