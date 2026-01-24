import { createFileRoute } from "@tanstack/react-router";
import { TastingsPage } from "../../../../pages/TastingsPage";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings")({
  component: TastingsPage,
});
