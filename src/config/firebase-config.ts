import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

const {
  REACT_APP_FB_API_KEY,
  REACT_APP_FB_AUTH_DOMAIN,
  REACT_APP_FB_DATABASE_URL,
  REACT_APP_FB_PROJECT_ID,
  REACT_APP_FB_STORAGE_BUCKET,
  REACT_APP_FB_MESSAGING_SENDER_ID,
  REACT_APP_FB_APP_ID,
  REACT_APP_FB_MEASUREMENT_ID,
} = process.env;

// Firebase configuration
const config = {
  apiKey: REACT_APP_FB_API_KEY,
  authDomain: REACT_APP_FB_AUTH_DOMAIN,
  databaseURL: REACT_APP_FB_DATABASE_URL,
  projectId: REACT_APP_FB_PROJECT_ID,
  storageBucket: REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: REACT_APP_FB_APP_ID,
  measurementId: REACT_APP_FB_MEASUREMENT_ID,
};

// initialize Firebase
firebase.initializeApp(config);
firebase.analytics();
firebase.firestore();

firebase
  .firestore()
  .enablePersistence()
  .catch(function (err) {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      console.log("failed-precondition");
    } else if (err.code === "unimplemented") {
      // The current browser does not support all of the
      // features required to enable persistence
      console.log("unimplemented");
    }
  });

export default config;
