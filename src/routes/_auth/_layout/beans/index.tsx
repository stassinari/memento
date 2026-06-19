import { createFileRoute, redirect } from "@tanstack/react-router";

// /beans has no page of its own — it lands on the default (Open) tab, each of
// which is its own route so browser-back behaves.
export const Route = createFileRoute("/_auth/_layout/beans/")({
  beforeLoad: () => {
    throw redirect({ to: "/beans/open" });
  },
});
