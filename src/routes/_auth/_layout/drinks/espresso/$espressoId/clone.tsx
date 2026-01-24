import { createFileRoute } from "@tanstack/react-router";
import { EspressoClone } from "../../../../../../pages/espresso/EspressoClone";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/clone",
)({
  component: EspressoClone,
});
