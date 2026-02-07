import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, isNotNull, isNull, or } from "drizzle-orm";
import { db } from "./db";
import {
  beans,
  brews,
  espresso,
  espressoDecentReadings,
  featureFlags,
  users,
} from "./schema";
import type {
  BeansWithUser,
  BeanWithRelations,
  BrewWithBeans,
  EspressoWithBeans,
} from "./types";

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
  .handler(async ({ data: firebaseUid }): Promise<BrewWithBeans[]> => {
    try {
      const brewsList = await db
        .select()
        .from(brews)
        .innerJoin(beans, eq(brews.beansId, beans.id))
        .innerJoin(users, eq(brews.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(brews.date))
        .limit(50);
      return brewsList as BrewWithBeans[];
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
  .handler(
    async ({
      data: { brewFbId, firebaseUid },
    }): Promise<BrewWithBeans | null> => {
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

        return brew as BrewWithBeans;
      } catch (error) {
        console.error("Database error:", error);
        throw error;
      }
    },
  );

export const getEspressos = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }): Promise<EspressoWithBeans[]> => {
    try {
      const espressoList = await db
        .select()
        .from(espresso)
        .leftJoin(beans, eq(espresso.beansId, beans.id))
        .innerJoin(users, eq(espresso.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(espresso.date))
        .limit(50);
      return espressoList as EspressoWithBeans[];
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
  .handler(
    async ({
      data: { espressoFbId, firebaseUid },
    }): Promise<EspressoWithBeans | null> => {
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

        return shot as EspressoWithBeans;
      } catch (error) {
        console.error("Database error:", error);
        throw error;
      }
    },
  );

export const getPartialEspressos = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }): Promise<EspressoWithBeans[]> => {
    try {
      const espressoList = await db
        .select()
        .from(espresso)
        .leftJoin(beans, eq(espresso.beansId, beans.id))
        .innerJoin(users, eq(espresso.userId, users.id))
        .where(and(eq(users.fbId, firebaseUid), eq(espresso.partial, true)))
        .orderBy(desc(espresso.date))
        .limit(5);
      return espressoList as EspressoWithBeans[];
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
  .handler(async ({ data: firebaseUid }): Promise<BeansWithUser[]> => {
    try {
      const beansList = await db
        .select()
        .from(beans)
        .innerJoin(users, eq(beans.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(beans.roastDate));
      return beansList as BeansWithUser[];
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
  .handler(async ({ data: firebaseUid }): Promise<BeansWithUser[]> => {
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
      return beansList as BeansWithUser[];
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
  .handler(async ({ data: firebaseUid }): Promise<BeansWithUser[]> => {
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
      return beansList as BeansWithUser[];
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
  .handler(async ({ data: firebaseUid }): Promise<BeansWithUser[]> => {
    try {
      // Archived beans: marked as finished
      const beansList = await db
        .select()
        .from(beans)
        .innerJoin(users, eq(beans.userId, users.id))
        .where(and(eq(users.fbId, firebaseUid), eq(beans.isFinished, true)))
        .orderBy(desc(beans.roastDate));
      return beansList as BeansWithUser[];
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
  .handler(
    async ({
      data: { beanFbId, firebaseUid },
    }): Promise<BeanWithRelations | null> => {
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
        } as BeanWithRelations;
      } catch (error) {
        console.error("Database error:", error);
        throw error;
      }
    },
  );
