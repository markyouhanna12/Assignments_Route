import { Socket } from 'socket.io';

export interface ISocketUser {
  userId: string;
  firstName?: string;
  lastName?: string;
}

export interface ISocketData {
  user: ISocketUser;
}

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  ISocketData
>;

export interface ClientToServerEvents {
  sendMessage: (data: { to: string; content: string }) => void;

  markAsRead: (data: { from: string }) => void;

  typing: (data: { to: string }) => void;

  stopTyping: (data: { to: string }) => void;
}

export interface ServerToClientEvents {
  onlineFriends: (data: { friends: string[] }) => void;
  userOnline: (data: { userId: string; firstName?: string }) => void;

  userOffline: (data: { userId: string }) => void;

  newMessage: (data: unknown) => void;

  messageSent: (data: unknown) => void;

  messagesRead: (data: { by: string; count: number }) => void;

  userTyping: (data: { userId: string; firstName?: string }) => void;

  userStopTyping: (data: { userId: string }) => void;

  socketError: (data: { event: string; error: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}
