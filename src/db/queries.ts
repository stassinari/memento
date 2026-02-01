import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";
import { featureFlags } from "./schema";

export const getFeatureFlags = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const sectionsList = await db
      .select()
      .from(featureFlags)
      .orderBy(featureFlags.name);
    return sectionsList;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
});
