import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

const {
  VITE_FB_API_KEY,
  VITE_FB_AUTH_DOMAIN,
  VITE_FB_DATABASE_URL,
  VITE_FB_PROJECT_ID,
  VITE_FB_STORAGE_BUCKET,
  VITE_FB_MESSAGING_SENDER_ID,
  VITE_FB_APP_ID,
  VITE_FB_MEASUREMENT_ID,
  VITE_VAPID_KEY,
} = import.meta.env;

// Firebase configuration
export const firebaseConfig = {
  apiKey: VITE_FB_API_KEY,
  authDomain: VITE_FB_AUTH_DOMAIN,
  databaseURL: VITE_FB_DATABASE_URL,
  projectId: VITE_FB_PROJECT_ID,
  storageBucket: VITE_FB_STORAGE_BUCKET,
  messagingSenderId: VITE_FB_MESSAGING_SENDER_ID,
  appId: VITE_FB_APP_ID,
  measurementId: VITE_FB_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const messaging = getMessaging(app);
provider.setCustomParameters({ prompt: "select_account" });

export const getMessagingToken = (setTokenFound: (arg0: boolean) => void) => {
  return getToken(messaging, {
    vapidKey: VITE_VAPID_KEY,
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};
