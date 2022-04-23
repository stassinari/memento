import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Suspense, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "reactfire";
import "twin.macro";
import { GoogleIcon } from "./icons/GoogleIcon";

const signOut = (auth: Auth) =>
  auth.signOut().then(() => console.log("signed out"));

const signInWithGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
};

export const Layout = () => {
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div tw="w-6/12 mx-auto">
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

      <div tw="divider">or</div>

      <button tw="gap-2 btn btn-block" onClick={() => signInWithGoogle(auth)}>
        <GoogleIcon />
        Sign in with Google
      </button>

      <div tw="divider"></div>

      <button tw="btn btn-block" onClick={() => signOut(auth)}>
        Sign out
      </button>

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
