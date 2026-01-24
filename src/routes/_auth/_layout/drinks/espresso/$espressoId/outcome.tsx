import { createFileRoute } from "@tanstack/react-router";
import { EspressoEditOutcome } from "../../../../../../pages/espresso/EspressoEditOutcome";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/outcome",
)({
  component: EspressoEditOutcome,
});
