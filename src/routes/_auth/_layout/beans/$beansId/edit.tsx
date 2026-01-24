import { createFileRoute } from "@tanstack/react-router";
import { BeansEdit } from "../../../../../pages/beans/BeansEdit";

export const Route = createFileRoute("/_auth/_layout/beans/$beansId/edit")({
  component: BeansEdit,
});
