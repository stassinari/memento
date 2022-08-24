import { Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "reactfire";
import "twin.macro";
import { Button } from "./Button";
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
    <Button
      label="Sign in with Google"
      width="full"
      variant="white"
      Icon={GoogleIcon}
      onClick={async () => {
        await signInWithGoogle(auth);
        navigate(redirectTo ? redirectTo : "/");
      }}
    />
  );
};
