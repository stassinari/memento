import React from "react";
import { EmailPasswordLogin } from "../components/EmailPasswordLogin";
import { GoogleLogin } from "../components/GoogleLogin";

export const LogIn = () => {
  return (
    <div>
      <EmailPasswordLogin />
      <div tw="divider">or</div>
      <GoogleLogin />
    </div>
  );
};
