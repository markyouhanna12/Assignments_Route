import { io } from './socket.server';

export interface INewApplicationNotification {
  applicationId: string;
  jobId: string;
  companyId: string;
  applicantId: string;
  jobTitle: string;
  message: string;
}

export const emitToUser = (userId: string, event: string, data: unknown): void => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }

  io.to(`user:${userId}`).emit(event, data);
};

export const emitNewApplication = (userId: string, data: INewApplicationNotification): void => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }

  io.to(`user:${userId}`).emit('newApplication', data);
};
