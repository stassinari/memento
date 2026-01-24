import { createFileRoute } from "@tanstack/react-router";
import { BrewsTableWrapper } from "../../../../../pages/brews/BrewsTable";

export const Route = createFileRoute("/_auth/_layoutFull/drinks/brews/table")({
  component: BrewsTableWrapper,
});
