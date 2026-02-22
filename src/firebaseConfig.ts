import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getVertexAI } from "firebase/vertexai";

const {
  VITE_FB_API_KEY,
  VITE_FB_AUTH_DOMAIN,
  VITE_FB_DATABASE_URL,
  VITE_FB_PROJECT_ID,
  VITE_FB_STORAGE_BUCKET,
  VITE_FB_MESSAGING_SENDER_ID,
  VITE_FB_APP_ID,
  VITE_FB_MEASUREMENT_ID,
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

// Initialize Firebase only on client-side
// On server, these will be undefined but shouldn't be accessed
// TODO: this is temporary until I get rid of Firebase
const app = typeof window !== "undefined" ? initializeApp(firebaseConfig) : null;

const db = app ? getFirestore(app) : (null as any);
const auth = app ? getAuth(app) : (null as any);
export const provider = app ? new GoogleAuthProvider() : (null as any);

if (provider) {
  provider.setCustomParameters({ prompt: "select_account" });
}

const vertex = app ? getVertexAI(app) : (null as any);

// // Connect to Firebase emulators when running on localhost
// if (typeof window !== "undefined" && window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, "127.0.0.1", 8080);
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
// }

export { auth, db, vertex };
