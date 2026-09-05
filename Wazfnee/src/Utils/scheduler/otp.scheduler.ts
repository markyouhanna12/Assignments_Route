import cron from 'node-cron';
import { UserModel } from '../../DB/Models/user.model';

export const startOtpCleanupJob = (): void => {
  cron.schedule('0 */6 * * *', async () => {
    try {
      const result = await UserModel.updateMany(
        {
          'otp.expiresIn': {
            $lte: new Date(),
          },
        },
        {
          $pull: {
            otp: {
              expiresIn: {
                $lte: new Date(),
              },
            },
          },
        },
      );

      console.log(
        `[OTP CRON] Expired OTP cleanup completed. Modified users: ${result.modifiedCount}`,
      );
    } catch (error) {
      console.error('[OTP CRON] Failed to delete expired OTPs:', error);
    }
  });

  console.log('[OTP CRON] Expired OTP cleanup job started.');
};
