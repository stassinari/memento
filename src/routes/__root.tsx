import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { NotFound } from "../components/ErrorPage";
import { NotificationContainer } from "../components/NotificationContainer";
import { useInitUser } from "../hooks/useInitUser";

const RootComponent = () => {
  const isUserLoading = useInitUser();

  if (isUserLoading) return null;

  return (
    <Suspense fallback={<div>Initializing...</div>}>
      <NotificationContainer />
      <Outlet />
    </Suspense>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});
