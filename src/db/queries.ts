import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, isNotNull, isNull, or } from "drizzle-orm";
import { db } from "./db";
import { beans, brews, espresso, featureFlags, users } from "./schema";

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

export const getEspressos = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      const espressoList = await db
        .select()
        .from(espresso)
        .leftJoin(beans, eq(espresso.beansId, beans.id))
        .innerJoin(users, eq(espresso.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(espresso.date))
        .limit(50);
      return espressoList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getEspresso = createServerFn({
  method: "GET",
})
  .inputValidator((input: { espressoFbId: string; firebaseUid: string }) => {
    if (!input.espressoFbId) throw new Error("Espresso ID is required");
    if (!input.firebaseUid) throw new Error("User ID is required");
    return input;
  })
  .handler(async ({ data: { espressoFbId, firebaseUid } }) => {
    try {
      const [shot] = await db
        .select()
        .from(espresso)
        .leftJoin(beans, eq(espresso.beansId, beans.id))
        .innerJoin(users, eq(espresso.userId, users.id))
        .where(and(eq(espresso.fbId, espressoFbId), eq(users.fbId, firebaseUid)))
        .limit(1);
      return shot;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getBeans = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      const beansList = await db
        .select()
        .from(beans)
        .innerJoin(users, eq(beans.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(beans.roastDate));
      return beansList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getBeansOpen = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      // Open beans: not finished AND (never frozen OR thawed)
      const beansList = await db
        .select()
        .from(beans)
        .innerJoin(users, eq(beans.userId, users.id))
        .where(
          and(
            eq(users.fbId, firebaseUid),
            eq(beans.isFinished, false),
            or(isNull(beans.freezeDate), isNotNull(beans.thawDate)),
          ),
        )
        .orderBy(desc(beans.roastDate));
      return beansList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getBeansFrozen = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      // Frozen beans: not finished AND frozen but not thawed
      const beansList = await db
        .select()
        .from(beans)
        .innerJoin(users, eq(beans.userId, users.id))
        .where(
          and(
            eq(users.fbId, firebaseUid),
            eq(beans.isFinished, false),
            isNotNull(beans.freezeDate),
            isNull(beans.thawDate),
          ),
        )
        .orderBy(desc(beans.freezeDate));
      return beansList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getBeansArchived = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      // Archived beans: marked as finished
      const beansList = await db
        .select()
        .from(beans)
        .innerJoin(users, eq(beans.userId, users.id))
        .where(and(eq(users.fbId, firebaseUid), eq(beans.isFinished, true)))
        .orderBy(desc(beans.roastDate));
      return beansList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getBean = createServerFn({
  method: "GET",
})
  .inputValidator((input: { beanFbId: string; firebaseUid: string }) => {
    if (!input.beanFbId) throw new Error("Bean ID is required");
    if (!input.firebaseUid) throw new Error("User ID is required");
    return input;
  })
  .handler(async ({ data: { beanFbId, firebaseUid } }) => {
    try {
      // Get the bean with all related brews and espressos
      const [beanData] = await db
        .select()
        .from(beans)
        .innerJoin(users, eq(beans.userId, users.id))
        .where(and(eq(beans.fbId, beanFbId), eq(users.fbId, firebaseUid)))
        .limit(1);

      if (!beanData) {
        return null;
      }

      // Get related brews
      const relatedBrews = await db
        .select()
        .from(brews)
        .where(eq(brews.beansId, beanData.beans.id))
        .orderBy(desc(brews.date));

      // Get related espressos
      const relatedEspressos = await db
        .select()
        .from(espresso)
        .where(eq(espresso.beansId, beanData.beans.id))
        .orderBy(desc(espresso.date));

      return {
        ...beanData,
        brews: relatedBrews,
        espressos: relatedEspressos,
      };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });
