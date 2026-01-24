import { createFileRoute } from "@tanstack/react-router";
import { BrewClone } from "../../../../../../pages/brews/BrewClone";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/brews/$brewId/clone",
)({
  component: BrewClone,
});
