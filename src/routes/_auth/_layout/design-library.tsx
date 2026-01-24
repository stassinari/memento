import { createFileRoute } from "@tanstack/react-router";
import { DesignLibrary } from "../../../pages/DesignLibrary";

export const Route = createFileRoute("/_auth/_layout/design-library")({
  component: DesignLibrary,
});
