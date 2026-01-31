import { useNavigate } from "@tanstack/react-router";
import {
  Auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "~/firebaseConfig";
import { useRedirectTo } from "~/hooks/useRedirectTo";
import { Button } from "./Button";
import { GoogleIcon } from "./icons/GoogleIcon";

const signInWithGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);

  // Wait for auth state to update before resolving
  return new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe();
        resolve();
      }
    });
  });
};

export const GoogleLogin = () => {
  const navigate = useNavigate();
  const redirectTo = useRedirectTo();

  return (
    <Button
      width="full"
      variant="white"
      onClick={async () => {
        await signInWithGoogle(auth);
        navigate({ to: redirectTo || "/" });
      }}
    >
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
};
