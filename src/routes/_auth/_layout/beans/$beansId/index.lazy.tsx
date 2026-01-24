import { createLazyFileRoute } from "@tanstack/react-router";
import BeansDetails from "../../../../../pages/beans/BeansDetails";

export const Route = createLazyFileRoute("/_auth/_layout/beans/$beansId/")({
  component: BeansDetails,
});
