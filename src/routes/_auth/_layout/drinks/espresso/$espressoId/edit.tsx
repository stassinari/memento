import { createFileRoute } from "@tanstack/react-router";
import { EspressoEditDetails } from "../../../../../../pages/espresso/EspressoEditDetails";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/edit",
)({
  component: EspressoEditDetails,
});
