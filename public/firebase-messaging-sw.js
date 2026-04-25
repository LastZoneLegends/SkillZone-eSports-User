// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBjVaNDIoUvm0La7OwGqLxmMFQcrNb_Oh4",
  authDomain: "skillzone-esports.firebaseapp.com",
  projectId: "skillzone-esports",
  storageBucket: "skillzone-esports.firebasestorage.app",
  messagingSenderId: "496866292552",
  appId: "1:496866292552:web:21054909e1ce530243f97d"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);

  const notificationTitle =
    payload.notification?.title || payload.data?.title || "New Notification";

  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: "/icons/icon-192x192.png",

    data: {
      url: payload.data?.url || "/"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  let urlToOpen = "/";

  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }

  // If external URL (starts with http)
  if (urlToOpen.startsWith("http")) {
    event.waitUntil(clients.openWindow(urlToOpen));
    return;
  }

  // Internal route (/wallet /profile etc)
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
