import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import "twin.macro";
import { AuthStatus } from "./auth/AuthStatus";

export const Layout = () => {
  return (
    <div tw="w-6/12 mx-auto">
      <header tw="flex justify-between">
        <nav>
          <ol tw="flex gap-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="test">Test</Link>
            </li>
            <li>
              <Link to="beans">Beans</Link>
            </li>
            <li>
              <Link to="public">Public page</Link>
            </li>
            <li>
              <Link to="no-auth">No auth page</Link>
            </li>
          </ol>
        </nav>
        <AuthStatus />
      </header>

      <div tw="mt-16">
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
