import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getAuthInitPromise } from "~/hooks/useInitUser";

export const Route = createFileRoute("/_public")({
  beforeLoad: async () => {
    // On server, skip auth check (will be handled on client)
    if (typeof window === "undefined") {
      return;
    }

    // Wait for auth to initialize before checking
    const user = await getAuthInitPromise();

    if (user) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: () => <Outlet />,
});
