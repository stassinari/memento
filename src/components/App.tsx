import { getAuth } from "firebase/auth";
import {
  enableIndexedDbPersistence,
  initializeFirestore,
} from "firebase/firestore";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AuthProvider,
  FirestoreProvider,
  useFirebaseApp,
  useInitFirestore,
} from "reactfire";
import { Gags } from "../pages/Gags";
import { LogIn } from "../pages/LogIn";
import { Lolz } from "../pages/Lolz";
import { RequireAuth } from "./auth/RequireAuth";
import { RequireNoAuth } from "./auth/RequireNoAuth";
import { Layout } from "./Layout";

export const App = () => {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);

  // initialise Firestore
  const { data: firestoreInstance } = useInitFirestore(async (firebaseApp) => {
    const db = initializeFirestore(firebaseApp, {});
    try {
      await enableIndexedDbPersistence(db);
      return db;
    } catch (err: any) {
      if (err.code === "failed-precondition") {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        console.log("failed-precondition");
      } else if (err.code === "unimplemented") {
        // The current browser does not support all of the
        // features required to enable persistence
        console.log("unimplemented");
      }
    } finally {
      return db;
    }
  });

  return (
    <AuthProvider sdk={auth}>
      <Suspense fallback={<div>Initializing...</div>}>
        <FirestoreProvider sdk={firestoreInstance}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="lolz" element={<Lolz />} />

                <Route element={<RequireNoAuth />}>
                  <Route path="login" element={<LogIn />} />
                </Route>

                <Route element={<RequireAuth />}>
                  <Route path="gags" element={<Gags />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </FirestoreProvider>
      </Suspense>
    </AuthProvider>
  );
};
