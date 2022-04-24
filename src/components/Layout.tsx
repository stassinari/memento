import React, { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import "twin.macro";
import { AuthStatus } from "./auth/AuthStatus";

export const Layout = () => {
  return (
    <div tw="w-6/12 mx-auto">
      <AuthStatus />
      <div tw="mt-16">
        <Link to="gags">Gags</Link>
        <Link to="lolz">Lolz</Link>
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
