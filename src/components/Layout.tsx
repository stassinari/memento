import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import "twin.macro";
import { EmailPasswordLogin } from "./EmailPasswordLogin";
import { GoogleLogin } from "./GoogleLogin";
import { LogOut } from "./LogOut";

export const Layout = () => {
  return (
    <div tw="w-6/12 mx-auto">
      <EmailPasswordLogin />

      <div tw="divider">or</div>

      <GoogleLogin />

      <div tw="divider"></div>

      <LogOut />

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
