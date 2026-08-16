import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FIREBASE_SERVICE_ACCOUNT } from '../../config/config.service';
import chalk from 'chalk';

let firebaseApp: App | undefined;
let messaging: Messaging | undefined;

export const initializeFirebase = (): void => {
  const keyPath = resolve(FIREBASE_SERVICE_ACCOUNT);

  if (!existsSync(keyPath)) {
    throw new Error(`Firebase service account key file not found at path: ${keyPath}`);
  }

  try {
    const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));

    if (getApps().length === 0) {
      firebaseApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      firebaseApp = getApps()[0];
    }

    if (!firebaseApp) {
      throw new Error('[Firebase] Failed to initialize Firebase app');
    }

    messaging = getMessaging(firebaseApp);

    console.log(chalk.bold.green('[Firebase] Initialized successfully.'));
  } catch (error) {
    console.error(chalk.red('[Firebase] Initialization failed:'), error);
  }
};

export const getFirebaseMessaging = (): Messaging | undefined => {
  return messaging;
};

export const getFirebaseApp = (): App | undefined => {
  return firebaseApp;
};
