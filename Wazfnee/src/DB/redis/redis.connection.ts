import { createClient } from 'redis';
import chalk from 'chalk';
import { REDIS_URI } from '../../Config/config.service';

export const redisClient = createClient({
  url: REDIS_URI,
});

export const redisConnection = async (): Promise<void> => {
  try {
    await redisClient.connect();

    console.log(chalk.bold.green('Redis connected successfully'));
  } catch (error) {
    console.error(chalk.red('Redis connection failed'), error);
  }
};
