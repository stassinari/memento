import { createFileRoute } from "@tanstack/react-router";
import { AiPlayground } from "../../../pages/AiPlayground";

export const Route = createFileRoute("/_auth/_layout/ai")({
  component: AiPlayground,
});
