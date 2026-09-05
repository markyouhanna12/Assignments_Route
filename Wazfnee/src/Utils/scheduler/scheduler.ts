import { startOtpCleanupJob } from './otp.scheduler';

export const startSchedulers = (): void => {
  startOtpCleanupJob();
};
