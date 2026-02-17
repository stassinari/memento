import { createServerFn } from "@tanstack/react-start";
import {
  and,
  desc,
  eq,
  getTableColumns,
  isNotNull,
  isNull,
  or,
} from "drizzle-orm";
import { db } from "./db";
import { beans, brews, espresso, users } from "./schema";

export const getUser = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.fbId, firebaseUid),
      });
      return user;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getLastBrew = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      const lastBrew = await db
        .select({ ...getTableColumns(brews) })
        .from(brews)
        .innerJoin(users, eq(brews.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(brews.date))
        .limit(1)
        .then((results) => results[0] || null);
      return lastBrew;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

// FIXME this is fetching way more data than needed. Beans should just really
// come as a string (for name) and users are only needed for ownership
// verification, which can be done in the same query without joining the whole table
export const getBrews = createServerFn({
  method: "GET",
})
  .inputValidator(
    (input: { firebaseUid: string; limit?: number; offset?: number }) => {
      if (!input.firebaseUid) throw new Error("User ID is required");
      return {
        firebaseUid: input.firebaseUid,
        limit: input.limit ?? 50,
        offset: input.offset ?? 0,
      };
    },
  )
  .handler(async ({ data: { firebaseUid, limit, offset } }) => {
    try {
      const brewsList = await db
        .select()
        .from(brews)
        .innerJoin(beans, eq(brews.beansId, beans.id))
        .innerJoin(users, eq(brews.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(brews.date))
        .limit(limit)
        .offset(offset);
      return brewsList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

const brewFormSuggestionFields = [
  "method",
  "grinder",
  "grinderBurrs",
  "waterType",
  "filterType",
] as const;

export const getBrewFormValueSuggestions = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      const brewsList = await db
        .select({
          method: brews.method,
          grinder: brews.grinder,
          grinderBurrs: brews.grinderBurrs,
          waterType: brews.waterType,
          filterType: brews.filterType,
        })
        .from(brews)
        .innerJoin(users, eq(brews.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(brews.date));

      // Extract unique values per field, preserving most-recent-first order
      return Object.fromEntries(
        brewFormSuggestionFields.map((field) => [
          field,
          [...new Set(brewsList.map((b) => b[field]).filter(Boolean))],
        ]),
      ) as Record<(typeof brewFormSuggestionFields)[number], string[]>;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getBrew = createServerFn({
  method: "GET",
})
  .inputValidator((input: { brewId: string; firebaseUid: string }) => {
    if (!input.brewId) throw new Error("Brew ID is required");
    if (!input.firebaseUid) throw new Error("User ID is required");
    return input;
  })
  .handler(async ({ data: { brewId, firebaseUid } }) => {
    try {
      const brew = await db.query.brews.findFirst({
        where: (brews, { eq }) => eq(brews.id, brewId),
        with: {
          beans: true,
          user: true,
        },
      });

      if (!brew || brew.user.fbId !== firebaseUid) {
        return null;
      }

      return { ...brew, beans: brew.beans };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

// FIXME this is fetching way more data than needed. Beans should just really
// come as a string (for name) and users are only needed for ownership
// verification, which can be done in the same query without joining the whole table
export const getEspressos = createServerFn({
  method: "GET",
})
  .inputValidator(
    (input: { firebaseUid: string; limit?: number; offset?: number }) => {
      if (!input.firebaseUid) throw new Error("User ID is required");
      return {
        firebaseUid: input.firebaseUid,
        limit: input.limit ?? 50,
        offset: input.offset ?? 0,
      };
    },
  )
  .handler(async ({ data: { firebaseUid, limit, offset } }) => {
    try {
      const espressoList = await db
        .select()
        .from(espresso)
        .leftJoin(beans, eq(espresso.beansId, beans.id))
        .innerJoin(users, eq(espresso.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(espresso.date))
        .limit(limit)
        .offset(offset);
      return espressoList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getEspressoFormValueSuggestions = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      const espressoList = await db
        .select({
          machine: espresso.machine,
          grinder: espresso.grinder,
          grinderBurrs: espresso.grinderBurrs,
          basket: espresso.basket,
        })
        .from(espresso)
        .innerJoin(users, eq(espresso.userId, users.id))
        .where(eq(users.fbId, firebaseUid))
        .orderBy(desc(espresso.date));

      // Extract unique values per field, preserving most-recent-first order
      const fields = ["machine", "grinder", "grinderBurrs", "basket"] as const;
      return Object.fromEntries(
        fields.map((field) => [
          field,
          [...new Set(espressoList.map((e) => e[field]).filter(Boolean))],
        ]),
      ) as Record<(typeof fields)[number], string[]>;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getEspresso = createServerFn({
  method: "GET",
})
  .inputValidator((input: { espressoId: string; firebaseUid: string }) => {
    if (!input.espressoId) throw new Error("Espresso ID is required");
    if (!input.firebaseUid) throw new Error("User ID is required");
    return input;
  })
  .handler(async ({ data: { espressoId, firebaseUid } }) => {
    try {
      const espresso = await db.query.espresso.findFirst({
        where: (espresso, { eq }) => eq(espresso.id, espressoId),
        with: {
          beans: true,
          user: true,
          decentReadings: true,
        },
      });

      if (!espresso || espresso.user.fbId !== firebaseUid) {
        return null;
      }

      return { ...espresso, beans: espresso.beans };
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

export const getLastEspresso = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      const lastEspresso = await db
        .select({ ...getTableColumns(espresso) })
        .from(espresso)
        .innerJoin(users, eq(espresso.userId, users.id))
        .where(
          and(
            eq(users.fbId, firebaseUid),
            or(isNull(espresso.partial), eq(espresso.partial, false)),
          ),
        ) // not partial excludes Decent shots that haven't had details added yet
        .orderBy(desc(espresso.date))
        .limit(1)
        .then((results) => results[0] || null);
      return lastEspresso;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getDecentReadings = createServerFn({
  method: "GET",
})
  .inputValidator((input: { espressoId: string }) => {
    if (!input.espressoId) throw new Error("Espresso ID is required");
    return input;
  })
  .handler(async ({ data: { espressoId } }) => {
    try {
      const decentReadings = await db.query.espressoDecentReadings.findFirst({
        where: (espressoDecentReadings, { eq }) =>
          eq(espressoDecentReadings.espressoId, espressoId),
      });

      return decentReadings;
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

// TODO can I combine these 4 next function into 1?

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
  .handler(async ({ data: firebaseUid }) => {
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
  .handler(async ({ data: firebaseUid }) => {
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

export const getBeansNonArchived = createServerFn({
  method: "GET",
})
  .inputValidator((firebaseUid: string) => {
    if (!firebaseUid) throw new Error("User ID is required");
    return firebaseUid;
  })
  .handler(async ({ data: firebaseUid }) => {
    try {
      // Non-archived beans: not marked as finished
      const beansList = await db
        .select({
          id: beans.id,
          name: beans.name,
          roaster: beans.roaster,
          roastDate: beans.roastDate,
          origin: beans.origin,
          country: beans.country,
          isFinished: beans.isFinished,
          freezeDate: beans.freezeDate, // TODO can i define a "virtual column" here, i.e isFrozen?
          thawDate: beans.thawDate, // TODO can i define a "virtual column" here, i.e isThawed?
        })
        .from(beans)
        .innerJoin(users, eq(beans.userId, users.id))
        .where(and(eq(users.fbId, firebaseUid), eq(beans.isFinished, false)))
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
      // Single query with relations + ownership verification
      const bean = await db.query.beans.findFirst({
        where: (beans, { eq }) => eq(beans.id, beanId),
        with: {
          user: true, // Include user to verify ownership
          brews: {
            orderBy: (brews, { desc }) => [desc(brews.date)],
          },
          espressos: {
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
        espressos: bean.espressos,
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
      const beansList = await db
        .select({
          roaster: beans.roaster,
          roastDate: beans.roastDate,
        })
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
