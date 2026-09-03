import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './Utils/cors/cors.utils';
import { NotFoundException } from './Utils/response/error.response';
import { customRateLimiter } from './Middlewares/rateLimitter.middleware';
import connectDB from './DB/connection';

const app = express();

connectDB();

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(customRateLimiter);

app.use('/*dummy', (req: Request, res: Response): Response => {
  throw new NotFoundException('Not Found Handler!');
});

export default app;
