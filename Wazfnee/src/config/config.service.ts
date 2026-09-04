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

export const WHITE_LIST = requiredEnv('WHITE_LIST');

export const SALT = requiredEnv('SALT');
export const ENCRYPTION_SECRET_KEY = requiredEnv('ENCRYPTION_SECRET_KEY');

export const TOKEN_ACCESS_USER_SECRET_KEY = requiredEnv('TOKEN_ACCESS_USER_SECRET_KEY');
export const TOKEN_REFRESH_USER_SECRET_KEY = requiredEnv('TOKEN_REFRESH_USER_SECRET_KEY');

export const TOKEN_ACCESS_ADMIN_SECRET_KEY = requiredEnv('TOKEN_ACCESS_ADMIN_SECRET_KEY');
export const TOKEN_REFRESH_ADMIN_SECRET_KEY = requiredEnv('TOKEN_REFRESH_ADMIN_SECRET_KEY');

export const ACCESS_EXPIRES = requiredEnv('ACCESS_EXPIRES');
export const REFRESH_EXPIRES = requiredEnv('REFRESH_EXPIRES');

// send Email configs

export const USER_EMAIL = requiredEnv('USER_EMAIL');
export const USER_PASSWORD = requiredEnv('USER_PASSWORD');

export const GOOGLE_CLIENT_ID = requiredEnv('GOOGLE_CLIENT_ID');
