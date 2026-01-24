import { createLazyFileRoute } from "@tanstack/react-router";
import BrewDetails from "../../../../../../pages/brews/BrewDetails";

export const Route = createLazyFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/",
)({
  component: BrewDetails,
});
