import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Layout } from "../../components/Layout";

export const Route = createFileRoute("/_auth/_layoutFull")({
  component: () => (
    <Layout fullWidth>
      <Outlet />
    </Layout>
  ),
});
