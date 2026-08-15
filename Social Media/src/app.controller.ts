import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './Utils/cors/cors.utils';
import { customRateLimiter } from './Middlewares/rateLimitter.middleware';
import { globalErrorHandler, NotFoundException } from './Utils/response/error.response';
import connectDB from './DB/connection';
import AuthRouter from './Modules/Auth/auth.controller';
import UserRouter from './Modules/User/user.controller';
import PostRouter from './Modules/Post/post.controller';

import { redisConnection } from './DB/redis.connection';
import { NotificationService } from './Utils/services/notification.service';
import { initalizeFirebase } from './Utils/services/notification.config';

const app = express();

connectDB();
redisConnection();
initalizeFirebase();

const notificationService = new NotificationService();

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(customRateLimiter);

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/post', PostRouter);

app.post('/send-notification', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM token is required',
      });
    }

    await notificationService.sendNotification({
      token,
      data: {
        title: 'Hello from Social Media App 👋',
        body: 'This notification was sent successfully!',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error instanceof Error ? error.message : error,
    });
  }
});

app.use(globalErrorHandler);

app.use('/*dummy', (req: Request, res: Response): Response => {
  throw new NotFoundException('Not Found Handler!');
});

export default app;
