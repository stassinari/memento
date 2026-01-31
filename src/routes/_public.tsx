import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { auth } from "~/firebaseConfig";

export const Route = createFileRoute("/_public")({
  beforeLoad: () => {
    if (auth.currentUser) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: () => <Outlet />,
});
