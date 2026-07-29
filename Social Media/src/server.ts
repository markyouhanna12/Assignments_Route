import chalk from 'chalk';
import { createServer } from 'http';
import { PORT } from './config/config.service';
import app from './app.controller';

const httpServer = createServer(app);

const startServer = async () => {
  try {
    httpServer.listen(PORT, () => {
      console.log(chalk.bold.blue(`HTTP & Socket.IO server running on port ${PORT}`));
    });
  } catch (error) {
    console.log(chalk.red(String(error)));
  }
};

startServer();
