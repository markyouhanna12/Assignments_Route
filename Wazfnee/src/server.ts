import 'reflect-metadata';
import { createServer } from 'http';
import { PORT } from './Config/config.service';
import chalk from 'chalk';
import app from './app.controller';
import { startSchedulers } from './Utils/scheduler/scheduler';
import connectDB from './DB/connection';
import { redisConnection } from './DB/redis/redis.connection';

const httpServer = createServer(app);

const startServer = async () => {
  try {
    startSchedulers();
    await connectDB();
    await redisConnection();

    httpServer.listen(PORT, () => {
      console.log(chalk.bold.blue(`HTTP server running on port ${PORT}`));
    });
  } catch (error) {
    console.log(chalk.red(String(error)));
  }
};

startServer();
