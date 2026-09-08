importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');

importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyCqvjzALoYc58FdlQm0462VCXoRnsw0PIk',
  authDomain: 'social-media-app-79e10.firebaseapp.com',
  projectId: 'social-media-app-79e10',
  storageBucket: 'social-media-app-79e10.firebasestorage.app',
  messagingSenderId: '208278841275',
  appId: '1:208278841275:web:61cc2841ed57783a70c69e',
  measurementId: 'G-68K2E105P9',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message:', payload);

  const notificationTitle = payload.notification?.title || 'Wazfnee';

  const notificationOptions = {
    body: payload.notification?.body || 'New notification',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
