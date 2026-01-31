import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { auth } from "~/firebaseConfig";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ location }) => {
    if (!auth.currentUser) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});
