import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "reactfire";
import "twin.macro";
import { useRedirectTo } from "./hooks/useRedirectTo";
import { GoogleIcon } from "./icons/GoogleIcon";

const signInWithGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
};

export const GoogleLogin = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const redirectTo = useRedirectTo();

  return (
    <button
      tw="gap-2"
      onClick={async () => {
        await signInWithGoogle(auth);
        navigate(redirectTo ? redirectTo : "/");
      }}
    >
      <GoogleIcon />
      Sign in with Google
    </button>
  );
};
