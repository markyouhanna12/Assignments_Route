import chalk from 'chalk';
import { createServer } from 'http';
import { PORT } from './config/config.service';
import app from './app.controller';
import { Server, Socket } from 'socket.io';

const httpServer = createServer(app);

const startServer = async () => {
  try {
    httpServer.listen(PORT, () => {
      console.log(chalk.bold.blue(`HTTP server running on port ${PORT}`));
    });
  } catch (error) {
    console.log(chalk.red(String(error)));
  }
};

startServer();
