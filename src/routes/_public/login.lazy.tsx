import { createLazyFileRoute } from "@tanstack/react-router";
import LogIn from "../../pages/LogIn";

export const Route = createLazyFileRoute("/_public/login")({
  component: LogIn,
});
