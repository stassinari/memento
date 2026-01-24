import { createFileRoute } from "@tanstack/react-router";
import { DecentUpload } from "../../../pages/DecentUpload";

export const Route = createFileRoute("/_auth/_layout/decent-upload")({
  component: DecentUpload,
});
