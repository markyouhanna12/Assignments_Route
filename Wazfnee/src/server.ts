import 'reflect-metadata';
import { createServer } from 'http';
import { PORT } from './Config/config.service';
import chalk from 'chalk';
import app, { setupGraphQL, setupNotFoundAndErrorHandlers } from './app.controller';
import { startSchedulers } from './Utils/scheduler/scheduler';
import connectDB from './DB/connection';
import { redisConnection } from './DB/redis/redis.connection';
import { apolloServer } from './GraphQL/graphql.server';
import { initializeSocket } from './Utils/socket/socket.server';
import { initializeFirebase } from './Utils/notification/notification.config';

const httpServer = createServer(app);
initializeSocket(httpServer);

const startServer = async () => {
  try {
    startSchedulers();
    await connectDB();
    await redisConnection();
    await initializeFirebase();

    await apolloServer.start();

    setupGraphQL();

    setupNotFoundAndErrorHandlers();

    httpServer.listen(PORT, () => {
      console.log(chalk.bold.blue(`HTTP server running on port ${PORT}`));
    });
  } catch (error) {
    console.log(chalk.red(String(error)));
  }
};

startServer();
