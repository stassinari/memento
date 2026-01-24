import { Layout } from "@/components/Layout";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout")({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
