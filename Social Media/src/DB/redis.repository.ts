import { Types } from 'mongoose';
import { redisClient } from './redis.connection';

interface TokenParams {
  userId: string | number;
}

interface RevokeTokenParams extends TokenParams {
  jti: string;
}

interface RedisSetParams {
  key: string;
  value: any;
  ttl?: number | null;
}

interface RedisUpdateParams {
  key: string;
  value: any;
  ttl?: number | null;
}

export const revokeTokenKeyPrefix = ({ userId }: TokenParams): string => {
  return `user:revokedTokens:${userId}`;
};
export const revokeTokenKey = ({ userId, jti }: RevokeTokenParams): string => {
  return `${revokeTokenKeyPrefix({ userId })}:${jti}`; //--> user:revokedTokens:userId:jti
};

export const revokeAllTokenKey = ({ userId }: TokenParams): string => {
  return `revokeAll:${userId}`;
};

export const otpKey = ({ email }: { email: string }): string => {
  return `otp:${email}`;
};

export const otpAttemptsKey = ({ email }: { email: string }): string => {
  return `otpAttempts:${email}`;
};

export const recoverAccountKey = ({ email }: { email: string }): string => {
  return `recoverAccount:${email}`;
};

export const recoverAccountAttemptsKey = ({ email }: { email: string }): string => {
  return `recoverAccountAttempts:${email}`;
};

export const incr = async ({ key }: { key: string }): Promise<number | undefined> => {
  try {
    return await redisClient.incr(key);
  } catch (error) {
    console.log('Redis Incr Error', error);
  }
};

export const set = async ({ key, value, ttl = null }: RedisSetParams): Promise<string | null> => {
  try {
    const data: string = typeof value != 'string' ? JSON.stringify(value) : value;
    if (ttl) {
      return await redisClient.set(key, data, {
        expiration: { type: 'EX', value: ttl },
      });
    } else {
      return await redisClient.set(key, data);
    }
  } catch (error) {
    console.log('Redis Set Error', error);
    return null;
  }
};

// get value from redis
export const get = async ({ key }: { key: string }): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.log('Redis Get Error', error);
    return null;
  }
};

// delete value from redis
export const del = async (key: string): Promise<number | boolean | null> => {
  try {
    const isExist = await redisClient.exists(key);
    if (!isExist) {
      return false;
    }
    return await redisClient.del(key);
  } catch (error) {
    console.log('Redis Delete Error', error);
    return null;
  }
};

// update value in redis
export const update = async ({
  key,
  value,
  ttl = null,
}: RedisUpdateParams): Promise<string | null | boolean> => {
  try {
    const isExist = await redisClient.exists(key);

    if (!isExist) {
      return false;
    }

    const data: string = typeof value != 'string' ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        expiration: { type: 'EX', value: ttl },
      });
    }
    return await redisClient.set(key, data);
  } catch (error) {
    console.log('Redis Update Error', error);
    return null;
  }
};

// expire key in redis
export const expire = async ({
  key,
  ttl,
}: {
  key: string;
  ttl: number;
}): Promise<number | boolean | null> => {
  try {
    const isExist = await redisClient.exists(key);
    if (!isExist) {
      return false;
    }
    return await redisClient.expire(key, ttl);
  } catch (error) {
    console.log('Redis Expire Error', error);
    return null;
  }
};

export const ttl = async (key: string): Promise<number | boolean | null> => {
  try {
    const isExist = await redisClient.exists(key);
    if (!isExist) {
      return false;
    }
    return await redisClient.ttl(key);
  } catch (error) {
    console.log('Redis TTL Error', error);
    return null;
  }
};

export const keys = async (pattern: string): Promise<string[] | null> => {
  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    console.log('Redis Keys Error', error);
    return null;
  }
};

export const FCM_KEY = (userId: Types.ObjectId | string) => {
  return `user:FCM:${userId.toString()}`;
};

export const addFCM = async (userId: Types.ObjectId | string, FCMToken: string) => {
  return await redisClient.sAdd(FCM_KEY(userId), FCMToken);
};

export const removeFCM = async (userId: Types.ObjectId | string, FCMToken: string) => {
  return await redisClient.sRem(FCM_KEY(userId), FCMToken);
};

export const getFCMs = async (userId: Types.ObjectId | string) => {
  return await redisClient.sMembers(FCM_KEY(userId));
};
