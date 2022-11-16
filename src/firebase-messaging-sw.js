/* eslint-disable no-undef */

// FIXME revisit when looking into Firebase notifications

// // Scripts for firebase and firebase messaging
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
// );

// // FIXME find a way to have this populated properly

// // const {
// //   VITE_FB_API_KEY,
// //   VITE_FB_AUTH_DOMAIN,
// //   VITE_FB_DATABASE_URL,
// //   VITE_FB_PROJECT_ID,
// //   VITE_FB_STORAGE_BUCKET,
// //   VITE_FB_MESSAGING_SENDER_ID,
// //   VITE_FB_APP_ID,
// //   VITE_FB_MEASUREMENT_ID,
// // } = import.meta.env;

// // Firebase configuration
// const config = {
//   apiKey: "AIzaSyB34N6u6BKCuSZt2cQPcfWT_GHV_jDIhks",
//   authDomain: "brewlog-prod.firebaseapp.com",
//   databaseURL: "https://brewlog-prod.firebaseio.com",
//   projectId: "brewlog-prod",
//   storageBucket: "brewlog-prod.appspot.com",
//   messagingSenderId: "905888347744",
//   appId: "1:905888347744:web:967e3f40833abbe3beb505",
//   measurementId: "G-JKQ1J4VGZD",
// };

// firebase.initializeApp(config);

// console.log(self.__WB_MANIFEST);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// // trying to fix reloading madness
// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
// });
