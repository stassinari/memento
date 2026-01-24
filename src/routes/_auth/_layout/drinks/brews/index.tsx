import { createFileRoute } from "@tanstack/react-router";
import { BrewsList } from "../../../../../pages/brews/BrewsList";

export const Route = createFileRoute("/_auth/_layout/drinks/brews/")({
  component: BrewsList,
});
