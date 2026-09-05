import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './Utils/cors/cors.utils';
import { globalErrorHandler, NotFoundException } from './Utils/response/error.response';
import { customRateLimiter } from './Middlewares/rateLimitter.middleware';
import AuthRouter from './Modules/Auth/auth.route';
import UserRouter from './Modules/User/user.route';

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(customRateLimiter);

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/user', UserRouter);

app.use(globalErrorHandler);

app.use('/*dummy', (req: Request, res: Response): Response => {
  throw new NotFoundException('Not Found Handler!');
});

export default app;
