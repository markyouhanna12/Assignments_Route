import { CorsOptions } from 'cors';
import { WHITE_LIST } from '../../config/config.service';

const whiteList: string[] = WHITE_LIST.split(',');

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (whiteList.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
};
