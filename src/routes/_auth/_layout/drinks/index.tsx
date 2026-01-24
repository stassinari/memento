import { createFileRoute } from "@tanstack/react-router";
import { DrinksPage } from "../../../../pages/DrinksPage";

export const Route = createFileRoute("/_auth/_layout/drinks/")({
  component: DrinksPage,
});
