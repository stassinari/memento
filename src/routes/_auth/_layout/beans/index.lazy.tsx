import { createLazyFileRoute } from "@tanstack/react-router";
import BeansList from "../../../../pages/beans/BeansList/BeansList";

export const Route = createLazyFileRoute("/_auth/_layout/beans/")({
  component: BeansList,
});
