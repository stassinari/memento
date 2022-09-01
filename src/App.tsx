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
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireNoAuth } from "./components/auth/RequireNoAuth";
import { Layout } from "./components/Layout";
import { BeansList } from "./pages/Beans";
import { BeansDetails } from "./pages/BeansDetails";
import { BrewsPage } from "./pages/BrewsPage";
import { DesignLibrary } from "./pages/DesignLibrary";
import { DrinksPage } from "./pages/DrinksPage";
import { EspressosPage } from "./pages/EspressosPage";
import { LogIn } from "./pages/LogIn";
import { NotFound } from "./pages/NotFound";
import { Profile } from "./pages/Profile";
import { TastingsPage } from "./pages/TastingsPage";

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
              {/* Add routes that display no matter the auth status */}
              <Route path="*" element={<NotFound />} />

              {/* Add routes that require the user NOT to be logged in */}
              <Route element={<RequireNoAuth />}>
                <Route path="login" element={<LogIn />} />
              </Route>

              {/* Add routes that REQUIRE the user to be logged in */}
              <Route path="/" element={<Layout />}>
                <Route element={<RequireAuth />}>
                  <Route path="/" element={<Homepage />} />
                  <Route path="beans" element={<BeansList />} />
                  <Route path="beans/:beansId" element={<BeansDetails />} />
                  <Route path="drinks" element={<DrinksPage />} />
                  <Route path="drinks/brews" element={<BrewsPage />} />
                  <Route path="drinks/espressos" element={<EspressosPage />} />
                  <Route path="drinks/tastings" element={<TastingsPage />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="design-library" element={<DesignLibrary />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </FirestoreProvider>
      </Suspense>
    </AuthProvider>
  );
};

const Homepage = () => <div>Dis da homepage, brah</div>;
