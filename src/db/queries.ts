import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, getTableColumns, isNull, or } from "drizzle-orm";
import { BeansStateName } from "~/routes/_auth/_layout/beans";
import { db } from "./db";
import { beans, brews, espresso, tastings } from "./schema";

type BeansRow = typeof beans.$inferSelect;
type TastingRow = typeof tastings.$inferSelect;
type TastingWithBeans = { tastings: TastingRow; beans: BeansRow | null };
type TastingWithOptionalBeans = TastingRow & { beans: BeansRow | null };

export const getUser = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  return db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, context.userId),
  });
});

export const getLastBrew = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  try {
    const lastBrew = await db
      .select({ ...getTableColumns(brews) })
      .from(brews)
      .where(eq(brews.userId, context.userId))
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
export const getBrews = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number; offset?: number }) => ({
    limit: input.limit,
    offset: input.offset ?? 0,
  }))
  .handler(async ({ data: { limit, offset }, context }) => {
    try {
      const query = db
        .select()
        .from(brews)
        .innerJoin(beans, eq(brews.beansId, beans.id))
        .where(eq(brews.userId, context.userId))
        .orderBy(desc(brews.date))
        .offset(offset)
        .$dynamic();

      const brewsList = await (limit ? query.limit(limit) : query);
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
}).handler(async ({ context }) => {
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
      .where(eq(brews.userId, context.userId))
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

export const getBrew = createServerFn({ method: "GET" })
  .inputValidator((input: { brewId: string }) => {
    if (!input.brewId) throw new Error("Brew ID is required");
    return input;
  })
  .handler(async ({ data: { brewId }, context }) => {
    try {
      const brew = await db.query.brews.findFirst({
        where: (brews, { and, eq }) => and(eq(brews.id, brewId), eq(brews.userId, context.userId)),
        with: {
          beans: true,
        },
      });

      if (!brew) {
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
export const getEspressos = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number; offset?: number }) => ({
    limit: input.limit ?? 50,
    offset: input.offset ?? 0,
  }))
  .handler(async ({ data: { limit, offset }, context }) => {
    try {
      const espressoList = await db
        .select()
        .from(espresso)
        .leftJoin(beans, eq(espresso.beansId, beans.id))
        .where(eq(espresso.userId, context.userId))
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
}).handler(async ({ context }) => {
  try {
    const espressoList = await db
      .select({
        machine: espresso.machine,
        grinder: espresso.grinder,
        grinderBurrs: espresso.grinderBurrs,
        basket: espresso.basket,
      })
      .from(espresso)
      .where(eq(espresso.userId, context.userId))
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

export const getEspresso = createServerFn({ method: "GET" })
  .inputValidator((input: { espressoId: string }) => {
    if (!input.espressoId) throw new Error("Espresso ID is required");
    return input;
  })
  .handler(async ({ data: { espressoId }, context }) => {
    try {
      const result = await db.query.espresso.findFirst({
        where: (espresso, { and, eq }) =>
          and(eq(espresso.id, espressoId), eq(espresso.userId, context.userId)),
        with: {
          beans: true,
          decentReadings: true,
        },
      });

      if (!result) {
        return null;
      }

      return { ...result, beans: result.beans };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getTastings = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number; offset?: number }) => ({
    limit: input.limit ?? 50,
    offset: input.offset ?? 0,
  }))
  .handler(async ({ data: { limit, offset }, context }) => {
    try {
      const tastingList = await db
        .select()
        .from(tastings)
        .leftJoin(beans, eq(tastings.beansId, beans.id))
        .where(eq(tastings.userId, context.userId))
        .orderBy(desc(tastings.createdAt))
        .limit(limit)
        .offset(offset);
      return tastingList as TastingWithBeans[];
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getTasting = createServerFn({ method: "GET" })
  .inputValidator((input: { tastingId: string }) => {
    if (!input.tastingId) throw new Error("Tasting ID is required");
    return input;
  })
  .handler(async ({ data: { tastingId }, context }) => {
    try {
      const result = await db.query.tastings.findFirst({
        where: (tastings, { and, eq }) =>
          and(eq(tastings.id, tastingId), eq(tastings.userId, context.userId)),
        with: {
          beans: true,
        },
      });

      if (!result) {
        return null;
      }

      return { ...result, beans: result.beans } as TastingWithOptionalBeans;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getPartialEspressos = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    try {
      const espressoList = await db
        .select()
        .from(espresso)
        .leftJoin(beans, eq(espresso.beansId, beans.id))
        .where(and(eq(espresso.userId, context.userId), eq(espresso.partial, true)))
        .orderBy(desc(espresso.date))
        .limit(5);
      return espressoList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  },
);

export const getLastEspresso = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  try {
    const lastEspresso = await db
      .select({ ...getTableColumns(espresso) })
      .from(espresso)
      .where(
        and(
          eq(espresso.userId, context.userId),
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

export const getDecentReadings = createServerFn({ method: "GET" })
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

export const getBeans = createServerFn({ method: "GET" })
  .inputValidator((input: { state: BeansStateName }) => input)
  .handler(async ({ data: { state }, context }) => {
    try {
      const stateFilter =
        state === "Open"
          ? eq(beans.isOpen, true)
          : state === "Frozen"
            ? eq(beans.isFrozen, true)
            : state === "Archived"
              ? eq(beans.isArchived, true)
              : undefined;

      const whereClause = stateFilter
        ? and(eq(beans.userId, context.userId), stateFilter)
        : eq(beans.userId, context.userId);

      const beansList = await db
        .select({ ...getTableColumns(beans) })
        .from(beans)
        .where(whereClause)
        .orderBy(desc(beans.roastDate));

      return beansList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  });

export const getSelectableBeans = createServerFn({ method: "GET" }).handler(async ({ context }) => {
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
        isArchived: beans.isArchived,
        isFrozen: beans.isFrozen,
        isOpen: beans.isOpen,
      })
      .from(beans)
      .where(and(eq(beans.userId, context.userId), eq(beans.isArchived, false)))
      .orderBy(desc(beans.roastDate));
    return beansList;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
});

export const getBean = createServerFn({ method: "GET" })
  .inputValidator((input: { beanId: string }) => {
    if (!input.beanId) throw new Error("Bean ID is required");
    return input;
  })
  .handler(async ({ data: { beanId }, context }) => {
    try {
      const bean = await db.query.beans.findFirst({
        where: (beans, { and, eq }) => and(eq(beans.id, beanId), eq(beans.userId, context.userId)),
        with: {
          brews: {
            orderBy: (brews, { desc }) => [desc(brews.date)],
          },
          espressos: {
            orderBy: (espresso, { desc }) => [desc(espresso.date)],
          },
        },
      });

      if (!bean) {
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

export const getBeansUniqueRoasters = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    try {
      const beansList = await db
        .select({
          roaster: beans.roaster,
          roastDate: beans.roastDate,
        })
        .from(beans)
        .where(eq(beans.userId, context.userId))
        .orderBy(desc(beans.roastDate));

      return beansList;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  },
);
