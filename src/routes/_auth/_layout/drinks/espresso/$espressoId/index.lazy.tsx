import { createLazyFileRoute } from "@tanstack/react-router";
import EspressoDetails from "../../../../../../pages/espresso/EspressoDetails";

export const Route = createLazyFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/",
)({
  component: EspressoDetails,
});
