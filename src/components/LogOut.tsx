import { Auth } from "firebase/auth";
import { useAuth } from "reactfire";
import "twin.macro";

const signOut = (auth: Auth) =>
  auth.signOut().then(() => console.log("signed out"));

export const LogOut = () => {
  const auth = useAuth();

  return <button onClick={() => signOut(auth)}>Sign out</button>;
};
