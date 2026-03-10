import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId")({
  component: TastingLayoutPage,
});

function TastingLayoutPage() {
  return <Outlet />;
}
