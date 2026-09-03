import mongoose from 'mongoose';
import chalk from 'chalk';
import { dbUrl } from '../Config/config.service';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log(chalk.bold.green('MongoDB connected successfully'));
    });
    mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.log(chalk.red('Error connecting Database'), error);
  }
};

export default connectDB;
