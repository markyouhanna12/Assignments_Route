import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: resolve('./config/dev.env'),
});

const requiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const PORT = requiredEnv('PORT');
export const dbUrl = requiredEnv('DB_URL');

export const SALT = requiredEnv('SALT');
export const ENCRYPTION_SECRET_KEY = requiredEnv('ENCRYPTION_SECRET_KEY');

// WHITE_LIST for cors
export const WHITE_LIST = requiredEnv('WHITE_LIST');
