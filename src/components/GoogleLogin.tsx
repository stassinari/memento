import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebaseConfig";
import { useRedirectTo } from "../hooks/useRedirectTo";
import { Button } from "./Button";
import { GoogleIcon } from "./icons/GoogleIcon";

const signInWithGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
};

export const GoogleLogin = () => {
  const navigate = useNavigate();

  const redirectTo = useRedirectTo();

  return (
    <Button
      width="full"
      variant="white"
      Icon={<GoogleIcon />}
      onClick={async () => {
        await signInWithGoogle(auth);
        navigate(redirectTo ? redirectTo : "/");
      }}
    >
      Sign in with Google
    </Button>
  );
};
