import { createClient, RedisClient } from 'redis';
import { REDIS_URI } from '../config/config.service';
import chalk from 'chalk';

export const redisClient = createClient({ url: REDIS_URI as string });

export const redisConnection = async () => {
  try {
    await redisClient.connect();
    console.log(chalk.bold.green('Redis connected successfully'));
  } catch (error) {
    console.error(chalk.red('Redis connection failed'), error);
  }
};
