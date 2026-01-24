import { auth } from "@/firebaseConfig";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

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
