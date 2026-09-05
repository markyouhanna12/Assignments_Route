import { redisClient } from './redis.connection';

interface RedisSetParams {
  key: string;
  value: unknown;
  ttl?: number | null;
}

interface RedisUpdateParams {
  key: string;
  value: unknown;
  ttl?: number | null;
}

export const incr = async ({ key }: { key: string }): Promise<number | undefined> => {
  try {
    return await redisClient.incr(key);
  } catch (error) {
    console.error('Redis incr error:', error);
    return undefined;
  }
};

export const set = async ({ key, value, ttl = null }: RedisSetParams): Promise<string | null> => {
  try {
    const data = typeof value !== 'string' ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        expiration: {
          type: 'EX',
          value: ttl,
        },
      });
    }

    return await redisClient.set(key, data);
  } catch (error) {
    console.error('Redis set error:', error);
    return null;
  }
};

export const get = async ({ key }: { key: string }): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const del = async (key: string): Promise<number | false | null> => {
  try {
    const exists = await redisClient.exists(key);

    if (!exists) {
      return false;
    }

    return await redisClient.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
    return null;
  }
};

export const update = async ({
  key,
  value,
  ttl = null,
}: RedisUpdateParams): Promise<string | null | false> => {
  try {
    const exists = await redisClient.exists(key);

    if (!exists) {
      return false;
    }

    const data = typeof value !== 'string' ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        expiration: {
          type: 'EX',
          value: ttl,
        },
      });
    }

    return await redisClient.set(key, data);
  } catch (error) {
    console.error('Redis update error:', error);
    return null;
  }
};

export const expire = async ({
  key,
  ttl,
}: {
  key: string;
  ttl: number;
}): Promise<number | false | null> => {
  try {
    const exists = await redisClient.exists(key);

    if (!exists) {
      return false;
    }

    return await redisClient.expire(key, ttl);
  } catch (error) {
    console.error('Redis expire error:', error);
    return null;
  }
};

export const ttl = async (key: string): Promise<number | false | null> => {
  try {
    const exists = await redisClient.exists(key);

    if (!exists) {
      return false;
    }

    return await redisClient.ttl(key);
  } catch (error) {
    console.error('Redis TTL error:', error);
    return null;
  }
};

export const keys = async (pattern: string): Promise<string[] | null> => {
  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    console.error('Redis keys error:', error);
    return null;
  }
};
