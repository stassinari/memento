import { createLazyFileRoute } from "@tanstack/react-router";
import EspressoAdd from "../../../../../pages/espresso/EspressoAdd";

export const Route = createLazyFileRoute("/_auth/_layout/drinks/espresso/add")({
  component: EspressoAdd,
});
