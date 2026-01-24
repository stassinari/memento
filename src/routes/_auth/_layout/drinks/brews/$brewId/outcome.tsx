import { createFileRoute } from "@tanstack/react-router";
import { BrewEditOutcome } from "../../../../../../pages/brews/BrewEditOutcome";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/outcome",
)({
  component: BrewEditOutcome,
});
