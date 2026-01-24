import { Layout } from "@/components/Layout";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layoutFull")({
  component: () => (
    <Layout fullWidth>
      <Outlet />
    </Layout>
  ),
});
