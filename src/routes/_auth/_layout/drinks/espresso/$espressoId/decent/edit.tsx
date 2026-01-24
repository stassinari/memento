import { createFileRoute } from "@tanstack/react-router";
import { DecentEspressoEditDetails } from "../../../../../../../pages/espresso/DecentEspressoEditDetails";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/decent/edit",
)({
  component: DecentEspressoEditDetails,
});
