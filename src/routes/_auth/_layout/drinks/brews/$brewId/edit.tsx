import { createFileRoute } from "@tanstack/react-router";
import { BrewEditDetails } from "../../../../../../pages/brews/BrewEditDetails";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/edit",
)({
  component: BrewEditDetails,
});
