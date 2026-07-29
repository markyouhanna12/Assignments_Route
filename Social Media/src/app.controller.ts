import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './Utils/cors/cors.utils';
import { customRateLimiter } from './Middlewares/rateLimitter.middleware';

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(customRateLimiter);

export default app;
