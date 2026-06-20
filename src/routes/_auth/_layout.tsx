import { Outlet, createFileRoute, useMatches } from "@tanstack/react-router";
import { Layout } from "~/components/Layout";

export const Route = createFileRoute("/_auth/_layout")({
  component: LayoutRoute,
});

function LayoutRoute() {
  // A route opts into the wide container with `staticData: { fullWidth: true }`
  // — no parallel `_layoutFull` tree needed.
  const fullWidth = useMatches().some((match) => match.staticData?.fullWidth);

  return (
    <Layout fullWidth={fullWidth}>
      <Outlet />
    </Layout>
  );
}
