importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCqvjzALoYc58FdlQm0462VCXoRnsw0PIk",
    authDomain: "social-media-app-79e10.firebaseapp.com",
    projectId: "social-media-app-79e10",
    storageBucket: "social-media-app-79e10.firebasestorage.app",
    messagingSenderId: "208278841275",
    appId: "1:208278841275:web:bc15de8a6565896670c69e",
    measurementId: "G-7G1LKBNCF6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Background message:", payload);
    const { title, body } = payload.data || payload.notification || {};
    self.registration.showNotification(title || "Notification", {
        body: body || "",
        icon: "/icon.png"
    });
});
