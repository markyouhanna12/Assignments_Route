import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { FIREBASE_SERVICE_ACCOUNT } from '../../config/config.service';

const serviceAccount = JSON.parse(readFileSync(FIREBASE_SERVICE_ACCOUNT, 'utf8'));

const firebaseApp =
  admin.apps.length > 0
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

export default firebaseApp;
