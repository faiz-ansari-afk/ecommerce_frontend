// It's a static script file, so it won't be covered by a module bundling system
// hence, it uses "importScripts" function to load the other libs
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);



const firebaseConfig = {
  apiKey: '{{NEXT_PUBLIC_FIREBASE_API_KEY}}',
  authDomain: '{{NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}}',
  projectId: '{{NEXT_PUBLIC_FIREBASE_PROJECT_ID}}',
  storageBucket: '{{NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}}',
  messagingSenderId: '{{NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}}',
  appId: '{{NEXT_PUBLIC_FIREBASE_APP_ID}}',
  measurementId: '{{NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}}',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

























// Not necessary, but if you want to handle clicks on notifications
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();

//   const pathname = event.notification?.data?.FCM_MSG?.notification?.data?.link;
//   if (!pathname) return;
//   const url = new URL(pathname, self.location.origin).href;

//   event.waitUntil(
//     self.clients
//       .matchAll({ type: 'window', includeUncontrolled: true })
//       .then((clientsArr) => {
//         const hadWindowToFocus = clientsArr.some((windowClient) =>
//           windowClient.url === url ? (windowClient.focus(), true) : false
//         );

//         if (!hadWindowToFocus)
//           self.clients
//             .openWindow(url)
//             .then((windowClient) =>
//               windowClient ? windowClient.focus() : null
//             );
//       })
//   );
// });