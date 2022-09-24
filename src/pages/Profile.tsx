import { Auth } from "firebase/auth";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import "twin.macro";
import { Button } from "../components/Button";
import { auth } from "../firebaseConfig";
import { userAtom } from "../hooks/useInitUser";

const signOut = (auth: Auth) =>
  auth.signOut().then(() => console.log("signed out"));

export const Profile = () => {
  const [user] = useAtom(userAtom);

  return (
    <div>
      WIP profile page
      <div>Logged in as: {user?.email}</div>
      <Button variant="secondary" onClick={() => signOut(auth)}>
        Sign out
      </Button>
      <Button variant="white" as={Link} to="/design-library" tw="sm:hidden">
        Design Library
      </Button>
    </div>
  );
};
