import { Message, MulticastMessage } from 'firebase-admin/messaging';

import { getFirebaseMessaging } from './notification.config';

export interface IPushNotification {
  fid: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface IPushNotificationMulticast {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}
/**
 * Send a push notification to a single Firebase Installation ID.
 */
export const sendPushNotification = async ({
  fid,
  title,
  body,
  data,
}: IPushNotification): Promise<string | undefined> => {
  const messaging = getFirebaseMessaging();

  if (!messaging) {
    console.warn('[Firebase] Messaging is not initialized. Push notification skipped.');

    return undefined;
  }

  const message: Message = {
    notification: {
      title,
      body,
    },
    fid,
  };

  if (data) {
    message.data = data;
  }

  try {
    const response = await messaging.send(message);

    console.log(`[Firebase] Push notification sent successfully: ${response}`);

    return response;
  } catch (error) {
    console.error('[Firebase] Failed to send push notification:', error);

    return undefined;
  }
};

export const sendPushNotificationToMultipleDevices = async ({
  tokens,
  title,
  body,
  data,
}: IPushNotificationMulticast) => {
  const messaging = getFirebaseMessaging();

  if (!messaging) {
    console.warn('[Firebase] Messaging is not initialized. Push notifications skipped.');

    return undefined;
  }

  if (!tokens.length) {
    return undefined;
  }

  const message: MulticastMessage = {
    notification: {
      title,
      body,
    },
    tokens,
  };

  if (data) {
    message.data = data;
  }

  try {
    const response = await messaging.sendEachForMulticast(message);

    console.log(
      `[Firebase] Push notifications sent. Success: ${response.successCount}, Failed: ${response.failureCount}`,
    );

    return response;
  } catch (error) {
    console.error('[Firebase] Failed to send push notifications:', error);

    return undefined;
  }
};
