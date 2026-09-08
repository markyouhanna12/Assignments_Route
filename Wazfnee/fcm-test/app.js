import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';

import {
  getMessaging,
  getToken,
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCqvjzALoYc58FdlQm0462VCXoRnsw0PIk',
  authDomain: 'social-media-app-79e10.firebaseapp.com',
  projectId: 'social-media-app-79e10',
  storageBucket: 'social-media-app-79e10.firebasestorage.app',
  messagingSenderId: '208278841275',
  appId: '1:208278841275:web:61cc2841ed57783a70c69e',
  measurementId: 'G-68K2E105P9',
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

const generateTokenButton = document.getElementById('generateToken');

const status = document.getElementById('status');

const tokenTextarea = document.getElementById('token');

generateTokenButton.addEventListener('click', async () => {
  try {
    status.textContent = 'Registering service worker...';

    const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');

    console.log('Service worker registered:', registration);

    status.textContent = 'Requesting notification permission...';

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      status.textContent = 'Notification permission was not granted.';
      return;
    }

    status.textContent = 'Generating FCM token...';

    const token = await getToken(messaging, {
      vapidKey:
        'BP8kzHj28eZHdFSJx0raG5-jq_NuKDFFMMiL_ohqYrJgU7nO0HgAU1VQx7M0F3v3ditSCVR9p-1lOdLpmsaANNA',
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      status.textContent = 'No FCM token was generated.';
      return;
    }

    tokenTextarea.value = token;

    status.textContent = 'FCM token generated successfully!';

    console.log('FCM Token:', token);
  } catch (error) {
    console.error(error);

    status.textContent = `Error: ${error.message}`;
  }
});
