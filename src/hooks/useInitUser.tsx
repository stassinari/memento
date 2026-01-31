import { onAuthStateChanged, User } from "firebase/auth";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { auth } from "~/firebaseConfig";

export const userAtom = atom<User | null>(null);
export const authInitializedAtom = atom<boolean>(false);

// Promise that resolves when auth state is first determined
let authInitPromise: Promise<User | null> | null = null;
let authInitialized = false;

export const getAuthInitPromise = () => {
  // If auth was already initialized, return the current state immediately
  if (authInitialized) {
    return Promise.resolve(auth.currentUser);
  }

  // Otherwise, wait for first auth state change
  if (!authInitPromise) {
    authInitPromise = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        authInitialized = true;
        unsubscribe();
        resolve(user);
      });
    });
  }
  return authInitPromise;
};

export const useInitUser = () => {
  const setUser = useSetAtom(userAtom);
  const setAuthInitialized = useSetAtom(authInitializedAtom);

  useEffect(() => {
    // Set up auth state listener (client-side only)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      authInitialized = true; // Update module-level flag
      setUser(user);
      setAuthInitialized(true);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [setUser, setAuthInitialized]);
};

export const useCurrentUser = () => {
  const user = useAtomValue(userAtom);

  // On server, return null instead of throwing (components will handle this)
  if (typeof window === "undefined") {
    return null as any;
  }

  if (!user) throw new Error("User is not logged in.");

  return user;
};

export const useAuthInitialized = () => {
  return useAtomValue(authInitializedAtom);
};
