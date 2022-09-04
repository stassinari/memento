import { onAuthStateChanged, User } from "firebase/auth";
import { atom, useAtom } from "jotai";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireNoAuth } from "./components/auth/RequireNoAuth";
import { Layout } from "./components/Layout";
import { auth } from "./firebaseConfig";
import { BeansDetails } from "./pages/BeansDetails";
import { BeansPage } from "./pages/BeansPage";
import { BrewsPage } from "./pages/BrewsPage";
import { DesignLibrary } from "./pages/DesignLibrary";
import { DrinksPage } from "./pages/DrinksPage";
import { EspressosPage } from "./pages/EspressosPage";
import { LogIn } from "./pages/LogIn";
import { NotFound } from "./pages/NotFound";
import { Profile } from "./pages/Profile";
import { TastingsPage } from "./pages/TastingsPage";

export const userAtom = atom<User | null>(null);

export const App = () => {
  const [user, setUser] = useAtom(userAtom);
  console.log(user);
  onAuthStateChanged(auth, (user) => {
    setUser(user);
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log("user is signed in");
      console.log(user);
      // ...
    } else {
      // User is signed out
      // ...
      console.log("user is signed out");
    }
  });

  return (
    <Suspense fallback={<div>Initializing...</div>}>
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
              <Route path="beans" element={<BeansPage />} />
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
    </Suspense>
  );
};

const Homepage = () => <div>Dis da homepage, brah</div>;
