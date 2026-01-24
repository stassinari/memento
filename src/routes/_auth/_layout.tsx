import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Layout } from "../../components/Layout";

export const Route = createFileRoute("/_auth/_layout")({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
