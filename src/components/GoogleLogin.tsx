import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "reactfire";
import "twin.macro";
import { GoogleIcon } from "./icons/GoogleIcon";

const signInWithGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
};

export const GoogleLogin = () => {
  const auth = useAuth();

  return (
    <button tw="gap-2 btn btn-block" onClick={() => signInWithGoogle(auth)}>
      <GoogleIcon />
      Sign in with Google
    </button>
  );
};
