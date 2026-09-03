import { createServer } from 'http';
import { PORT } from './Config/config.service';
import chalk from 'chalk';
import app from './app.controller';

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
