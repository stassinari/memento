import { Auth } from "firebase/auth";
import { useAuth, useUser } from "reactfire";
import { Button } from "../components/Button";

const signOut = (auth: Auth) =>
  auth.signOut().then(() => console.log("signed out"));

export const Profile = () => {
  const { data: user } = useUser();
  const auth = useAuth();

  if (!user)
    throw new Error(
      "Impossible state: user is logged in but no user object was found."
    );

  return (
    <div>
      WIP profile page
      <div>Logged in as: {user.email}</div>
      <Button variant="secondary" onClick={() => signOut(auth)}>
        Sign out
      </Button>
    </div>
  );
};
