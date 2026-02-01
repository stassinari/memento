import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { beans, brews, featureFlags } from "./schema";

export const getFeatureFlags = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const flags = await db
      .select()
      .from(featureFlags)
      .orderBy(featureFlags.name);
    return flags;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
});

export const getBrews = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const brewsList = await db
      .select()
      .from(brews)
      .orderBy(desc(brews.date))
      .limit(50)
      .innerJoin(beans, eq(brews.beansId, beans.id));
    return brewsList;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
});
