import { createFileRoute } from "@tanstack/react-router";
import { DecentEspressoAddDetails } from "../../../../../../../pages/espresso/DecentEspressoAddDetails";

export const Route = createFileRoute(
  "/_auth/_layout/drinks/espresso/$espressoId/decent/add",
)({
  component: DecentEspressoAddDetails,
});
