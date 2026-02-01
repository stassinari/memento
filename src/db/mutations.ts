import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { featureFlags } from "./schema";

export const changeFeatureFlag = createServerFn({
  method: "POST",
})
  .inputValidator((data: { name: string; enabled: boolean }) => {
    if (!data || !data.name || typeof data.enabled !== "boolean") {
      throw new Error("Name and enabled status are required");
    }
    return data;
  })
  .handler(async ({ data }): Promise<void> => {
    try {
      const { name, enabled } = data;

      await db
        .update(featureFlags)
        .set({ enabled })
        .where(eq(featureFlags.name, name));
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });
