import { css } from "@emotion/react";
import {
  enableIndexedDbPersistence,
  initializeFirestore,
} from "firebase/firestore";
import { Suspense } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import { FirestoreProvider, useInitFirestore } from "reactfire";
import tw from "twin.macro";
import { Lolz } from "../pages/Lolz";

export const App = () => {
  const { status, data: firestoreInstance } = useInitFirestore(
    async (firebaseApp) => {
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
    }
  );

  if (status === "loading") {
    return <div>Initializing...</div>;
  }

  return (
    <Suspense fallback={<div>loading ALL THE THINGS</div>}>
      <FirestoreProvider sdk={firestoreInstance}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="lolz" element={<Lolz />} />
              <Route
                path="gags"
                element={
                  <div>
                    Hic sunt brutte gags
                    <button className="" css={[tw`btn btn-sm`]}>
                      Button
                    </button>
                  </div>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </FirestoreProvider>
    </Suspense>
  );
};

const Layout = () => {
  return (
    <div>
      <h1 tw="text-gray-500">Hic sunt React XVIII!</h1>
      <nav>
        <Link to="lolz">Lolz</Link> | <Link to="gags">Gags</Link>
      </nav>
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="40"
        tw="range"
      ></input>
      <input type="checkbox" tw="toggle" defaultChecked></input>
      <div
        tw="radial-progress"
        css={css`
          --value: 70;
        `}
      >
        70%
      </div>
      <div className="content">
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
