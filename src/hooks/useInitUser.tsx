import { onAuthStateChanged, User } from "firebase/auth";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { getUser } from "~/db/queries";
import { auth } from "~/firebaseConfig";

type UserWithRole = User & { role?: string; secretKey?: string | null };

export const userAtom = atom<UserWithRole | null>(null);
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      authInitialized = true; // Update module-level flag
      let role: string | undefined;
      let secretKey: string | null | undefined;

      if (user) {
        const idToken = await user.getIdToken(true);
        const decoded = JSON.parse(atob(idToken.split(".")[1]));
        role = decoded.role;

        try {
          const dbUser = await getUser({ data: user.uid });
          secretKey = dbUser?.secretKey ?? null;
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }

      setUser(user ? { ...user, role, secretKey } : null);
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
