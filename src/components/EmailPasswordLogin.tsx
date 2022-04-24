import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useAuth } from "reactfire";
import "twin.macro";

export const EmailPasswordLogin = () => {
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div tw="w-full form-control">
        <label tw="label">
          <span tw="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="E.g. pippo@franco.com"
          tw="w-full input input-bordered"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div tw="w-full form-control">
        <label tw="label">
          <span tw="label-text">Password</span>
        </label>
        <input
          type="password"
          tw="w-full input input-bordered"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        tw="my-4 btn btn-block"
        onClick={async () =>
          await signInWithEmailAndPassword(auth, email, password)
        }
      >
        Log in
      </button>
    </>
  );
};
