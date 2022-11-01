/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

// Scripts for firebase and firebase messaging
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { firebaseConfig } from "./firebaseConfig";
// Line below makes typescript happy by importing the definitions required for ServiceWorkerGlobalScope

const firebaseApp = initializeApp(firebaseConfig);

// @ts-ignore
console.log(self.__WB_MANIFEST);

// Retrieve firebase messaging
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification?.title || "Notification title";
  const notificationOptions = {
    body: payload.notification?.body || "Notification body",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
