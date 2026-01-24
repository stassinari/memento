import { createLazyFileRoute } from "@tanstack/react-router";
import EspressoList from "../../../../../pages/espresso/EspressoList";

export const Route = createLazyFileRoute("/_auth/_layout/drinks/espresso/")({
  component: EspressoList,
});
