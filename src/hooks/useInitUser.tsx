import { onAuthStateChanged, User } from "firebase/auth";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { auth } from "~/firebaseConfig";

export const userAtom = atom<User | null>(null);

export const useInitUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useSetAtom(userAtom);

  onAuthStateChanged(auth, (user) => {
    setIsLoading(false);
    setUser(user);
    if (user) {
      // User is signed in, see docs for a list of available properties
      // console.log("user is signed in");
      // ...
    } else {
      // User is signed out
      // console.log("user is signed out");
    }
  });

  return isLoading;
};

export const useCurrentUser = () => {
  const user = useAtomValue(userAtom);

  if (!user) throw new Error("User is not logged in.");

  return user;
};
