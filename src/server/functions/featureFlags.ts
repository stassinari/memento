import { createServerFn } from "@tanstack/react-start";
import { getAllFeatureFlags } from "@/server/utils/featureFlags.server";

export const getFeatureFlagsServer = createServerFn({ method: "GET" }).handler(
  async () => {
    return await getAllFeatureFlags();
  },
);
