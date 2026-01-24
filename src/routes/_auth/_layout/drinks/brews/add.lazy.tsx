import { createLazyFileRoute } from "@tanstack/react-router";
import BrewsAdd from "../../../../../pages/brews/BrewsAdd";

export const Route = createLazyFileRoute("/_auth/_layout/drinks/brews/add")({
  component: BrewsAdd,
});
