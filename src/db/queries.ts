import { createServerFn } from "@tanstack/react-start";
import {
  and,
  desc,
  eq,
  getTableColumns,
  isNotNull,
  isNull,
  max,
  or,
} from "drizzle-orm";
import { db } from "./db";
import {
  beans,
  brews,
  espresso,
  espressoDecentReadings,
  featureFlags,
  users,
} from "./schema";
import type { Beans } from "./types";

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

      if (!brew) {
        return null;
      }

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
        .where(
          and(eq(espresso.fbId, espressoFbId), eq(users.fbId, firebaseUid)),
        )
        .limit(1);

      if (!shot) {
        return null;
      }

      return shot;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getPartialEspressos = createServerFn({
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
        .where(and(eq(users.fbId, firebaseUid), eq(espresso.partial, true)))
        .orderBy(desc(espresso.date))
        .limit(5);
      return espressoList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getDecentReadings = createServerFn({
  method: "GET",
})
  .inputValidator((input: { espressoFbId: string; firebaseUid: string }) => {
    if (!input.espressoFbId) throw new Error("Espresso ID is required");
    if (!input.firebaseUid) throw new Error("User ID is required");
    return input;
  })
  .handler(async ({ data: { espressoFbId, firebaseUid } }) => {
    try {
      const [result] = await db
        .select({
          readings: espressoDecentReadings,
        })
        .from(espressoDecentReadings)
        .innerJoin(espresso, eq(espressoDecentReadings.espressoId, espresso.id))
        .innerJoin(users, eq(espresso.userId, users.id))
        .where(
          and(eq(espresso.fbId, espressoFbId), eq(users.fbId, firebaseUid)),
        )
        .limit(1);

      if (!result) {
        return null;
      }

      // Convert JSONB fields to arrays
      return {
        time: result.readings.time as number[],
        pressure: result.readings.pressure as number[],
        weightTotal: result.readings.weightTotal as number[],
        flow: result.readings.flow as number[],
        weightFlow: result.readings.weightFlow as number[],
        temperatureBasket: result.readings.temperatureBasket as number[],
        temperatureMix: result.readings.temperatureMix as number[],
        pressureGoal: result.readings.pressureGoal as number[],
        temperatureGoal: result.readings.temperatureGoal as number[],
        flowGoal: result.readings.flowGoal as number[],
      };
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
  .handler(async ({ data: firebaseUid }): Promise<Beans[]> => {
    try {
      // Open beans: not finished AND (never frozen OR thawed)
      const beansList = await db
        .select({ ...getTableColumns(beans) })
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
  .handler(async ({ data: firebaseUid }): Promise<Beans[]> => {
    try {
      // Frozen beans: not finished AND frozen but not thawed
      const beansList = await db
        .select({ ...getTableColumns(beans) })
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
  .handler(async ({ data: firebaseUid }): Promise<Beans[]> => {
    try {
      // Archived beans: marked as finished
      const beansList = await db
        .select({ ...getTableColumns(beans) })
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
  .inputValidator((input: { beanId: string; firebaseUid: string }) => {
    if (!input.beanId) throw new Error("Bean ID is required");
    if (!input.firebaseUid) throw new Error("User ID is required");
    return input;
  })
  .handler(async ({ data: { beanId, firebaseUid } }) => {
    try {
      // Single query with relations + ownership verification!
      const bean = await db.query.beans.findFirst({
        where: (beans, { eq }) => eq(beans.id, beanId),
        with: {
          user: true, // Include user to verify ownership
          brews: {
            orderBy: (brews, { desc }) => [desc(brews.date)],
          },
          espresso: {
            orderBy: (espresso, { desc }) => [desc(espresso.date)],
          },
        },
      });

      // Verify ownership
      if (!bean || bean.user.fbId !== firebaseUid) {
        return null;
      }

      return {
        ...bean,
        espressos: bean.espresso,
        brews: bean.brews,
      };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getBeansUniqueRoasters = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      const roasters = await db
        .select({
          roaster: beans.roaster,
          maxRoastDate: max(beans.roastDate),
        })
        .from(beans)
        .innerJoin(users, eq(beans.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .groupBy(beans.roaster)
        .orderBy(desc(max(beans.roastDate)));

      console.log(roasters);

      return roasters.map((r) => r.roaster);
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });
