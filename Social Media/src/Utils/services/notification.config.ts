import admin from 'firebase-admin';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { FIREBASE_SERVICE_ACCOUNT } from '../../config/config.service';
import chalk from 'chalk';
let messaging: admin.messaging.Messaging | null = null;

export const initalizeFirebase = (): void => {
  const keyPath = resolve(FIREBASE_SERVICE_ACCOUNT);

  if (!existsSync(keyPath)) {
    throw new Error(`Firebase service account key file not found at path: ${keyPath}`);
  }

  try {
    const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    messaging = admin.messaging();
    console.log(chalk.bold.green('[Firebase] Initialized successfully.'));
  } catch (error) {
    console.error(chalk.red('[Firebase] Initialization failed:'), error);
  }
};

export const getMessaging = (): admin.messaging.Messaging | null => messaging;

export { admin };
