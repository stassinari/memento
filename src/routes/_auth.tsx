import { Outlet, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { authInitializedAtom, getAuthInitPromise, userAtom } from "~/hooks/useInitUser";

function AuthLayout() {
  const authInitialized = useAuthInitialized();
  const user = useAtomValue(userAtom);
  const router = useRouter();

  // On client, redirect to login if not authenticated after auth initializes
  useEffect(() => {
    if (typeof window !== "undefined" && authInitialized && !user) {
      router.navigate({
        to: "/login",
        search: {
          redirect: window.location.pathname,
        },
      });
    }
  }, [authInitialized, user, router]);

  // Show loading state while auth is initializing or user is null
  // This matches both server and initial client render
  if (!authInitialized || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <Outlet />;
}

function useAuthInitialized() {
  return useAtomValue(authInitializedAtom);
}

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ location }) => {
    // On server, skip auth check (will be handled on client)
    if (typeof window === "undefined") {
      return;
    }

    // Wait for auth to initialize before checking
    const user = await getAuthInitPromise();

    if (!user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});
