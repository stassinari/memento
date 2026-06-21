import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, getTableColumns, isNotNull, isNull, or, sql } from "drizzle-orm";
import { BeansListItem } from "./types";
import { db } from "./db";
import { TastingVariable, beans, brews, espresso, tastingSamples, tastings } from "./schema";

type TastingRow = typeof tastings.$inferSelect;
type TastingSampleRow = typeof tastingSamples.$inferSelect;
type TastingWithSamples = TastingRow & { samples: TastingSampleRow[] };

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
      const tastingList = await db.query.tastings.findMany({
        where: (tastings, { eq }) => eq(tastings.userId, context.userId),
        orderBy: (tastings, { desc }) => [
          desc(sql`coalesce(${tastings.date}, ${tastings.createdAt})`),
        ],
        limit,
        offset,
        with: {
          samples: {
            orderBy: (samples, { asc }) => [asc(samples.position)],
          },
        },
      });

      return tastingList as TastingWithSamples[];
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
          samples: {
            orderBy: (samples, { asc }) => [asc(samples.position)],
          },
        },
      });

      if (!result) {
        return null;
      }

      return result as TastingWithSamples;
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

// Which slice of the cellar a Beans tab wants. Each tab is its own route and
// fetches only what it shows — so the Open tab never pays to transfer the
// hundreds of archived rows. History = everything (its table defaults to the
// archived view but can fold Open/Frozen back in via the status filter).
export type BeansListState = "Open" | "Frozen" | "History";

// Backs one Beans tab. Returns that state's bean rows, each enriched with its
// average score. The score aggregates are grouped per-bean (small result) and
// merged in JS; they scan the user's drinks regardless of tab, but that's cheap
// next to transferring every bean row, which is what the state filter avoids.
export const getBeansList = createServerFn({ method: "GET" })
  .inputValidator((input: { state: BeansListState }) => input)
  .handler(async ({ data: { state }, context }): Promise<BeansListItem[]> => {
    try {
      const userId = context.userId;

      const stateFilter =
        state === "Open"
          ? eq(beans.isOpen, true)
          : state === "Frozen"
            ? eq(beans.isFrozen, true)
            : undefined; // History → everything

      const beansList = await db
        .select({ ...getTableColumns(beans) })
        .from(beans)
        .where(stateFilter ? and(eq(beans.userId, userId), stateFilter) : eq(beans.userId, userId))
        .orderBy(desc(beans.roastDate));

      // Per-bean rating aggregates, computed once per source table then merged
      // in JS. Joining all three one-to-many tables in a single query would
      // multiply rows (fan-out) and corrupt the sums, so we keep them apart.
      // Only *rated* rows contribute, matching `getActivitySummary`.
      const [brewAgg, espressoAgg, tastingAgg] = await Promise.all([
        db
          .select({
            beansId: brews.beansId,
            sum: sql<number>`coalesce(sum(${brews.rating}), 0)`,
            count: sql<number>`count(${brews.rating})`,
          })
          .from(brews)
          .where(and(eq(brews.userId, userId), isNotNull(brews.rating)))
          .groupBy(brews.beansId),
        db
          .select({
            beansId: espresso.beansId,
            sum: sql<number>`coalesce(sum(${espresso.rating}), 0)`,
            count: sql<number>`count(${espresso.rating})`,
          })
          .from(espresso)
          .where(and(eq(espresso.userId, userId), isNotNull(espresso.rating)))
          .groupBy(espresso.beansId),
        // Tasting scores live on the samples; ownership + "is a beans tasting"
        // are enforced through the parent tasting (samples carry no userId).
        db
          .select({
            beansId: tastingSamples.variableValueBeansId,
            sum: sql<number>`coalesce(sum(${tastingSamples.overall}), 0)`,
            count: sql<number>`count(${tastingSamples.overall})`,
          })
          .from(tastingSamples)
          .innerJoin(tastings, eq(tastingSamples.tastingId, tastings.id))
          .where(
            and(
              eq(tastings.userId, userId),
              eq(tastings.variable, TastingVariable.Beans),
              isNotNull(tastingSamples.variableValueBeansId),
              isNotNull(tastingSamples.overall),
            ),
          )
          .groupBy(tastingSamples.variableValueBeansId),
      ]);

      // numeric/bigint aggregates arrive as strings over the wire → coerce.
      const totals = new Map<string, { sum: number; count: number }>();
      const fold = (rows: { beansId: string | null; sum: number; count: number }[]) => {
        for (const row of rows) {
          if (!row.beansId) continue;
          const prev = totals.get(row.beansId) ?? { sum: 0, count: 0 };
          prev.sum += Number(row.sum);
          prev.count += Number(row.count);
          totals.set(row.beansId, prev);
        }
      };
      fold(brewAgg);
      fold(espressoAgg);
      fold(tastingAgg);

      return beansList.map((bean): BeansListItem => {
        const agg = totals.get(bean.id);
        const ratedCount = agg?.count ?? 0;
        return {
          ...bean,
          ratedCount,
          avgScore: ratedCount > 0 ? agg!.sum / ratedCount : null,
        };
      });
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  },
);

// The three tab-badge counts in one round trip. Cheap (a single filtered count
// over the user's beans), so every tab route can show all counts without each
// loading the others' rows.
export const getBeansCounts = createServerFn({ method: "GET" }).handler(
  async ({ context }): Promise<{ open: number; frozen: number; archived: number }> => {
    try {
      const [row] = await db
        .select({
          open: sql<number>`count(*) filter (where ${beans.isOpen})`,
          frozen: sql<number>`count(*) filter (where ${beans.isFrozen})`,
          archived: sql<number>`count(*) filter (where ${beans.isArchived})`,
        })
        .from(beans)
        .where(eq(beans.userId, context.userId));

      return {
        open: Number(row?.open ?? 0),
        frozen: Number(row?.frozen ?? 0),
        archived: Number(row?.archived ?? 0),
      };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  },
);

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

export const getBeansLookup = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  try {
    const beansList = await db
      .select({
        id: beans.id,
        name: beans.name,
        roaster: beans.roaster,
      })
      .from(beans)
      .where(eq(beans.userId, context.userId));
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
          tastingSamples: {
            with: {
              tasting: true,
            },
            orderBy: (samples, { desc }) => [desc(samples.position)],
          },
        },
      });

      if (!bean) {
        return null;
      }

      const sampledInTastings = bean.tastingSamples
        .map((sample) => {
          const tasting = sample.tasting;
          if (!tasting) return null;
          if (tasting.userId !== context.userId) return null;
          if (tasting.variable !== TastingVariable.Beans) return null;

          return {
            id: sample.id,
            position: sample.position,
            note: sample.note,
            overall: sample.overall,
            flavours: sample.flavours,
            tasting: {
              id: tasting.id,
              method: tasting.method,
              date: tasting.date,
              createdAt: tasting.createdAt,
              note: tasting.note,
            },
          };
        })
        .filter((item) => item !== null)
        .sort((a, b) => {
          const aDate = a.tasting.date ?? a.tasting.createdAt;
          const bDate = b.tasting.date ?? b.tasting.createdAt;
          return bDate.getTime() - aDate.getTime();
        });

      return {
        ...bean,
        espressos: bean.espressos,
        brews: bean.brews,
        sampledInTastings,
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
