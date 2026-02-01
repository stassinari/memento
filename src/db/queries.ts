import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { beans, brews, featureFlags, users } from "./schema";

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
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      const brewsList = await db
        .select()
        .from(brews)
        .innerJoin(beans, eq(brews.beansId, beans.id))
        .innerJoin(users, eq(brews.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(brews.date))
        .limit(50);
      return brewsList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getBrew = createServerFn({
  method: "GET",
})
  .inputValidator((input: { brewFbId: string; firebaseUid: string }) => {
    if (!input.brewFbId) throw new Error("Brew ID is required");
    if (!input.firebaseUid) throw new Error("User ID is required");
    return input;
  })
  .handler(async ({ data: { brewFbId, firebaseUid } }) => {
    try {
      const [brew] = await db
        .select()
        .from(brews)
        .innerJoin(beans, eq(brews.beansId, beans.id))
        .innerJoin(users, eq(brews.userId, users.id))
        .where(and(eq(brews.fbId, brewFbId), eq(users.fbId, firebaseUid)))
        .limit(1);
      return brew;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });
