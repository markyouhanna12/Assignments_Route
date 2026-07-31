import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './Utils/cors/cors.utils';
import { customRateLimiter } from './Middlewares/rateLimitter.middleware';
import { globalErrorHandler, NotFoundException } from './Utils/response/error.response';
import connectDB from './DB/connection';
import AuthRouter from './Modules/Auth/auth.controller';
import UserRouter from './Modules/User/user.controller';
import { redisConnection } from './DB/redis.connection';

const app = express();

connectDB();
redisConnection();

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(customRateLimiter);

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);

app.use(globalErrorHandler);

app.use('/*dummy', (req: Request, res: Response): Response => {
  throw new NotFoundException('Not Found Handler!');
});

export default app;
