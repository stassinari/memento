import { createLazyFileRoute } from "@tanstack/react-router";
import BeansAdd from "../../../../pages/beans/BeansAdd";

export const Route = createLazyFileRoute("/_auth/_layout/beans/add")({
  component: BeansAdd,
});
