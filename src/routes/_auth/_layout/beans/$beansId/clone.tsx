import { createFileRoute } from "@tanstack/react-router";
import { BeansClone } from "../../../../../pages/beans/BeansClone";

export const Route = createFileRoute("/_auth/_layout/beans/$beansId/clone")({
  component: BeansClone,
});
