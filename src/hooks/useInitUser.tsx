import { onIdTokenChanged, User } from "firebase/auth";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { getUser } from "~/db/queries";
import { auth } from "~/firebaseConfig";

type UserWithRole = User & {
  role?: string;
  secretKey?: string | null;
  dbId?: string | null;
};

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

  // Otherwise, wait for first token change
  if (!authInitPromise) {
    authInitPromise = new Promise((resolve) => {
      const unsubscribe = onIdTokenChanged(auth, (user) => {
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
    // onIdTokenChanged fires on sign-in, sign-out, AND token refresh (every hour)
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      authInitialized = true;
      let role: string | undefined;
      let secretKey: string | null | undefined;
      let dbId: string | null | undefined;

      if (user) {
        const idToken = await user.getIdToken();
        const decoded = JSON.parse(atob(idToken.split(".")[1]));
        role = decoded.role;

        try {
          const dbUser = await getUser();
          secretKey = dbUser?.secretKey ?? null;
          dbId = dbUser?.id ?? null;
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }

      setUser(user ? { ...user, role, secretKey, dbId } : null);
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
