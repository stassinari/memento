import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray, sql } from "drizzle-orm";
import { BeansFormInputs } from "~/components/beans/BeansForm";
import { BrewFormInputs } from "~/components/brews/BrewForm";
import { BrewOutcomeInputs } from "~/components/brews/BrewOutcomeForm";
import { EspressoFormInputs } from "~/components/espresso/EspressoForm";
import { EspressoOutcomeInputs } from "~/components/espresso/EspressoOutcomeForm";
import { DecentEspressoFormInputs } from "~/components/espresso/steps/DecentEspressoForm";
import {
  TastingScoringFormInputs,
  TastingSetupFormInputs,
} from "~/components/tastings/form-types";
import { db } from "./db";
import {
  beans,
  brews,
  espresso,
  tastings,
  tastingSamples,
  TastingVariable,
  users,
} from "./schema";

/**
 * Validate beans input data
 */
function validateBeansInput(data: BeansFormInputs): void {
  // Required fields
  if (!data.name?.trim()) {
    throw new Error("Beans name is required");
  }
  if (!data.roaster?.trim()) {
    throw new Error("Roaster is required");
  }

  // Discriminated union validation
  if (data.origin === "blend") {
    if (!data.blendParts || data.blendParts.length === 0) {
      throw new Error("Blend must have at least one part");
    }
  }
}

/**
 * Generate a new secretKey for a user
 * Used for Decent Espresso integration
 */
export const generateSecretKey = createServerFn({ method: "POST" })
  .inputValidator((input: { secretKey: string }) => input)
  .handler(
    async ({
      data: { secretKey },
      context,
    }): Promise<{ secretKey: string }> => {
      try {
        await db
          .update(users)
          .set({ secretKey })
          .where(eq(users.id, context.userId));
      } catch (error) {
        console.error("Failed to update secret key:", error);
      }

      return { secretKey };
    },
  );

/**
 * Delete the secretKey for a user
 */
export const deleteSecretKey = createServerFn({ method: "POST" }).handler(
  async ({ context }): Promise<void> => {
    try {
      await db
        .update(users)
        .set({ secretKey: null })
        .where(eq(users.id, context.userId));
    } catch (error) {
      console.error("Failed to delete secret key:", error);
    }
  },
);

/**
 * Add new beans
 */
export const addBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { data: BeansFormInputs }) => {
    validateBeansInput(input.data);
    return input;
  })
  .handler(async ({ data: { data }, context }) => {
    try {
      // TODO move to the Form component
      const pgData = {
        userId: context.userId,
        name: data.name!, //FIXME
        roaster: data.roaster!, // FIXME
        roastDate: data.roastDate,
        roastStyle: data.roastStyle,
        roastLevel: data.roastLevel,
        roastingNotes: data.roastingNotes,
        freezeDate: data.freezeDate,
        thawDate: data.thawDate,
        isArchived: data.isArchived ?? false,
        origin: data.origin,
        // Single-origin fields (null if blend)
        country: data.origin === "single-origin" ? data.country : null,
        region: data.origin === "single-origin" ? data.region : null,
        varietals: data.origin === "single-origin" ? data.varietals : [],
        altitude: data.origin === "single-origin" ? data.altitude : null,
        process: data.origin === "single-origin" ? data.process : null,
        farmer: data.origin === "single-origin" ? data.farmer : null,
        harvestDate: data.origin === "single-origin" ? data.harvestDate : null,
        // Blend parts (null if single-origin)
        blendParts: data.origin === "blend" ? data.blendParts : null,
      };

      const [inserted] = await db
        .insert(beans)
        .values(pgData)
        .returning({ id: beans.id });

      return { id: inserted.id };
    } catch (error) {
      console.error("PostgreSQL insert failed:", error);
      throw error;
    }
  });

/**
 * Archive beans (set isArchived = true)
 */
export const archiveBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string }) => {
    if (!input.beansId) throw new Error("Beans ID is required");
    return input;
  })
  .handler(async ({ data: { beansId }, context }): Promise<void> => {
    try {
      await db
        .update(beans)
        .set({ isArchived: true })
        .where(and(eq(beans.id, beansId), eq(beans.userId, context.userId)));
    } catch (error) {
      console.error("PostgreSQL archive failed:", error);
    }
  });

/**
 * Unarchive beans (set isArchived = false)
 */
export const unarchiveBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string }) => {
    if (!input.beansId) throw new Error("Beans ID is required");
    return input;
  })
  .handler(async ({ data: { beansId }, context }): Promise<void> => {
    try {
      await db
        .update(beans)
        .set({ isArchived: false })
        .where(and(eq(beans.id, beansId), eq(beans.userId, context.userId)));
    } catch (error) {
      console.error("PostgreSQL unarchive failed:", error);
    }
  });

/**
 * Freeze beans (set freezeDate to current date)
 */
export const freezeBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string }) => {
    if (!input.beansId) throw new Error("Beans ID is required");
    return input;
  })
  .handler(async ({ data: { beansId }, context }): Promise<void> => {
    try {
      await db
        .update(beans)
        .set({ freezeDate: new Date() })
        .where(and(eq(beans.id, beansId), eq(beans.userId, context.userId)));
    } catch (error) {
      console.error("PostgreSQL freeze failed:", error);
    }
  });

/**
 * Thaw beans (set thawDate to current date)
 */
export const thawBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string }) => {
    if (!input.beansId) throw new Error("Beans ID is required");
    return input;
  })
  .handler(async ({ data: { beansId }, context }): Promise<void> => {
    try {
      await db
        .update(beans)
        .set({ thawDate: new Date() })
        .where(and(eq(beans.id, beansId), eq(beans.userId, context.userId)));
    } catch (error) {
      console.error("PostgreSQL thaw failed:", error);
    }
  });

/**
 * Delete beans
 */
export const deleteBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string }) => {
    if (!input.beansId) throw new Error("Beans ID is required");
    return input;
  })
  .handler(async ({ data: { beansId }, context }) => {
    try {
      const [hasBrews, hasEspressos, hasTastings, hasTastingSamples] =
        await Promise.all([
          db
            .select({ id: brews.id })
            .from(brews)
            .where(
              and(eq(brews.beansId, beansId), eq(brews.userId, context.userId)),
            )
            .limit(1),
          db
            .select({ id: espresso.id })
            .from(espresso)
            .where(
              and(
                eq(espresso.beansId, beansId),
                eq(espresso.userId, context.userId),
              ),
            )
            .limit(1),
          db
            .select({ id: tastings.id })
            .from(tastings)
            .where(
              and(
                eq(tastings.beansId, beansId),
                eq(tastings.userId, context.userId),
              ),
            )
            .limit(1),
          db
            .select({ id: tastingSamples.id })
            .from(tastingSamples)
            .innerJoin(tastings, eq(tastingSamples.tastingId, tastings.id))
            .where(
              and(
                eq(tastingSamples.variableValueBeansId, beansId),
                eq(tastings.userId, context.userId),
              ),
            )
            .limit(1),
        ]);

      if (
        hasBrews.length > 0 ||
        hasEspressos.length > 0 ||
        hasTastings.length > 0 ||
        hasTastingSamples.length > 0
      ) {
        return false;
      }

      await db
        .delete(beans)
        .where(and(eq(beans.id, beansId), eq(beans.userId, context.userId)));

      return true;
    } catch (error) {
      console.error("PostgreSQL delete failed:", error);
      return false;
    }
  });

/**
 * Update existing beans
 */
export const updateBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { data: BeansFormInputs; beansId: string }) => {
    if (!input.beansId) throw new Error("Beans ID is required");
    validateBeansInput(input.data);
    return input;
  })
  .handler(async ({ data: { data, beansId }, context }): Promise<void> => {
    const pgData = {
      name: data.name!,
      roaster: data.roaster!,
      roastDate: data.roastDate,
      roastStyle: data.roastStyle,
      roastLevel: data.roastLevel,
      roastingNotes: data.roastingNotes,
      freezeDate: data.freezeDate,
      thawDate: data.thawDate,
      isArchived: data.isArchived ?? false,
      origin: data.origin,
      // Single-origin fields (null if blend)
      country: data.origin === "single-origin" ? data.country : null,
      region: data.origin === "single-origin" ? data.region : null,
      varietals: data.origin === "single-origin" ? data.varietals : [],
      altitude: data.origin === "single-origin" ? data.altitude : null,
      process: data.origin === "single-origin" ? data.process : null,
      farmer: data.origin === "single-origin" ? data.farmer : null,
      harvestDate: data.origin === "single-origin" ? data.harvestDate : null,
      // Blend parts (null if single-origin)
      blendParts: data.origin === "blend" ? data.blendParts : null,
    };

    await db
      .update(beans)
      .set(pgData)
      .where(and(eq(beans.id, beansId), eq(beans.userId, context.userId)));
  });

// ============================================================================
// BREWS MUTATIONS
// ============================================================================

// TODO should we use Zod?
function validateBrewInput(data: BrewFormInputs): void {
  // Required fields
  if (!data.method?.trim()) {
    throw new Error("Brew method is required");
  }
  if (!data.beans?.trim()) {
    throw new Error("Beans selection is required");
  }
  if (!data.date) {
    throw new Error("Brew date is required");
  }
  if (!data.waterWeight || data.waterWeight <= 0) {
    throw new Error("Water weight must be positive");
  }
  if (!data.beansWeight || data.beansWeight <= 0) {
    throw new Error("Beans weight must be positive");
  }
}

export const addBrew = createServerFn({ method: "POST" })
  .inputValidator((input: { data: BrewFormInputs }) => {
    validateBrewInput(input.data);
    return input;
  })
  .handler(async ({ data: { data }, context }) => {
    try {
      const beansId = data.beans;
      if (!beansId) {
        throw new Error("Beans not found");
      }
      const pgData = {
        userId: context.userId,
        beansId,
        date: data.date!,
        method: data.method!,
        grinder: data.grinder,
        grinderBurrs: data.grinderBurrs,
        waterType: data.waterType,
        filterType: data.filterType,
        waterWeight: data.waterWeight!,
        beansWeight: data.beansWeight!,
        waterTemperature: data.waterTemperature,
        grindSetting: data.grindSetting,
        timeMinutes: data.timeMinutes,
        timeSeconds: data.timeSeconds,
        // Outcome fields (initially null)
        rating: null,
        notes: null,
        tds: null,
        finalBrewWeight: null,
        extractionType: null,
        // Tasting scores flattened
        aroma: null,
        acidity: null,
        sweetness: null,
        body: null,
        finish: null,
      };

      const [inserted] = await db
        .insert(brews)
        .values(pgData)
        .returning({ id: brews.id });

      return { id: inserted.id };
    } catch (error) {
      console.error("Add brew insert failed:", error);
      throw error;
    }
  });

export const updateBrew = createServerFn({ method: "POST" })
  .inputValidator((input: { data: BrewFormInputs; brewId: string }) => {
    if (!input.brewId) throw new Error("Brew ID is required");
    validateBrewInput(input.data);
    return input;
  })
  .handler(async ({ data: { data, brewId }, context }) => {
    try {
      const beansId = data.beans;
      if (!beansId) {
        throw new Error("Beans not found");
      }

      await db
        .update(brews)
        .set({ ...data, beansId } as Partial<typeof brews.$inferInsert>)
        .where(and(eq(brews.id, brewId), eq(brews.userId, context.userId)));

      return;
    } catch (error) {
      console.error("Update brew failed:", error);
      throw error;
    }
  });

/**
 * Update brew outcome fields (partial update)
 */
export const updateBrewOutcome = createServerFn({ method: "POST" })
  .inputValidator((input: { data: BrewOutcomeInputs; brewId: string }) => {
    if (!input.brewId) throw new Error("Brew ID is required");
    return input;
  })
  .handler(async ({ data: { data, brewId }, context }): Promise<void> => {
    try {
      await db
        .update(brews)
        .set(data)
        .where(and(eq(brews.id, brewId), eq(brews.userId, context.userId)));
    } catch (error) {
      console.error("Update brew outcome failed:", error);
      throw error;
    }
  });

/**
 * Delete brew
 */
export const deleteBrew = createServerFn({ method: "POST" })
  .inputValidator((input: { brewId: string }) => {
    if (!input.brewId) throw new Error("Brew ID is required");
    return input;
  })
  .handler(async ({ data: { brewId }, context }): Promise<void> => {
    try {
      await db
        .delete(brews)
        .where(and(eq(brews.id, brewId), eq(brews.userId, context.userId)));
    } catch (error) {
      console.error("PostgreSQL delete failed:", error);
    }
  });

// ============================================================================
// ESPRESSO MUTATIONS
// ============================================================================

// TODO should we use Zod?
function validateEspressoInput(data: EspressoFormInputs): void {
  // Required fields
  if (!data.beans?.trim()) {
    throw new Error("Beans selection is required");
  }
  if (!data.date) {
    throw new Error("Espresso date is required");
  }
  // Note: targetWeight, beansWeight, and actualTime can be null
  // They're only required for manual espressos (not Decent uploads)
}

/**
 * Add new espresso
 */
export const addEspresso = createServerFn({ method: "POST" })
  .inputValidator((input: { data: EspressoFormInputs }) => {
    validateEspressoInput(input.data);
    return input;
  })
  .handler(async ({ data: { data }, context }): Promise<{ id: string }> => {
    try {
      const beansId = data.beans;

      if (!beansId) {
        throw new Error("Beans not found");
      }

      const pgData = {
        userId: context.userId,
        beansId,
        date: data.date!,
        grindSetting: data.grindSetting,
        machine: data.machine,
        grinder: data.grinder,
        grinderBurrs: data.grinderBurrs,
        portafilter: data.portafilter,
        basket: data.basket,
        actualTime: data.actualTime ?? 0, // FIXME Default to 0 if not provided
        targetWeight: data.targetWeight ?? 0, // FIXME Default to 0 if not provided
        beansWeight: data.beansWeight ?? 0, // FIXME Default to 0 if not provided
        waterTemperature: data.waterTemperature,
        actualWeight: data.actualWeight,
        fromDecent: false,
        // Outcome fields (initially null)
        rating: null,
        notes: null,
        tds: null,
        // Tasting scores flattened
        aroma: null,
        acidity: null,
        sweetness: null,
        body: null,
        finish: null,
      };

      const [inserted] = await db
        .insert(espresso)
        .values(pgData)
        .returning({ id: espresso.id });

      return { id: inserted.id };
    } catch (error) {
      console.error("PostgreSQL insert failed:", error);
      throw error;
    }
  });

export const updateEspresso = createServerFn({ method: "POST" })
  .inputValidator((input: { data: EspressoFormInputs; espressoId: string }) => {
    if (!input.espressoId) throw new Error("Espresso ID is required");
    validateEspressoInput(input.data);
    return input;
  })
  .handler(async ({ data: { data, espressoId }, context }) => {
    try {
      const beansId = data.beans;
      if (!beansId) {
        throw new Error("Beans not found");
      }

      await db
        .update(espresso)
        .set({ ...data, beansId } as Partial<typeof espresso.$inferInsert>)
        .where(
          and(eq(espresso.id, espressoId), eq(espresso.userId, context.userId)),
        );

      return;
    } catch (error) {
      console.error("Update espresso failed:", error);
      throw error;
    }
  });

/**
 * Update espresso outcome fields (partial update)
 */
export const updateEspressoOutcome = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { data: EspressoOutcomeInputs; espressoId: string }) => {
      if (!input.espressoId) throw new Error("Espresso ID is required");
      return input;
    },
  )
  .handler(async ({ data: { data, espressoId }, context }) => {
    try {
      await db
        .update(espresso)
        .set(data)
        .where(
          and(eq(espresso.id, espressoId), eq(espresso.userId, context.userId)),
        );
    } catch (error) {
      console.error("PostgreSQL outcome update failed:", error);
    }
  });

/**
 * Delete espresso
 */
export const deleteEspresso = createServerFn({ method: "POST" })
  .inputValidator((input: { espressoId: string }) => {
    if (!input.espressoId) throw new Error("Espresso ID is required");
    return input;
  })
  .handler(async ({ data: { espressoId }, context }): Promise<void> => {
    try {
      await db
        .delete(espresso)
        .where(
          and(eq(espresso.id, espressoId), eq(espresso.userId, context.userId)),
        );
    } catch (error) {
      console.error("PostgreSQL delete failed:", error);
    }
  });

/**
 * Update Decent espresso partial details (add shot info)
 * Sets partial=false and adds beans + equipment details
 */
export const updateDecentEspressoDetails = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { data: DecentEspressoFormInputs; espressoId: string }) => {
      if (!input.espressoId) throw new Error("Espresso ID is required");
      return input;
    },
  )
  .handler(async ({ data: { data, espressoId }, context }): Promise<void> => {
    try {
      const beansId = data.beans;
      if (!beansId) {
        throw new Error("Beans not found for the provided beansId");
      }

      // Update espresso with decent details
      await db
        .update(espresso)
        .set({
          partial: false,
          beansId,
          grindSetting: data.grindSetting,
          machine: data.machine,
          grinder: data.grinder,
          grinderBurrs: data.grinderBurrs,
          portafilter: data.portafilter,
          basket: data.basket,
          actualWeight: data.actualWeight,
          targetWeight: data.targetWeight,
          beansWeight: data.beansWeight,
        })
        .where(
          and(eq(espresso.id, espressoId), eq(espresso.userId, context.userId)),
        );

      return;
    } catch (error) {
      console.error("PostgreSQL update failed:", error);
      throw error;
    }
  });

// ============================================================================
// TASTINGS MUTATIONS
// ============================================================================

function validateTastingInput(data: TastingSetupFormInputs): void {
  if (!data.date) {
    throw new Error("Tasting date is required");
  }
  if (!data.variable) {
    throw new Error("Tasting variable is required");
  }
  if (data.samples.length < 2) {
    throw new Error("At least two samples are required");
  }

  data.samples.forEach((sample, index) => {
    const isBeansVariable = data.variable === TastingVariable.Beans;
    if (isBeansVariable && !sample.variableValueBeansId) {
      throw new Error(`Sample #${index + 1} must have beans selected`);
    }
    if (!isBeansVariable && !sample.variableValueText?.trim()) {
      throw new Error(`Sample #${index + 1} must have a variable value`);
    }
  });
}

const nullableText = (value: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const sanitizeNullableNumber = (value: number | null): number | null =>
  value === null || Number.isNaN(value) ? null : value;

/* Helper function to ensure all provided beans IDs belong to the current user.
 * This is important for security, especially since some beans IDs come from the client (e.g. tasting samples).
 */
const assertOwnedBeansIds = async (
  userId: string,
  beansIds: string[],
): Promise<void> => {
  if (beansIds.length === 0) return;

  const ownedBeans = await db.query.beans.findMany({
    where: (b, { and, eq, inArray }) =>
      and(eq(b.userId, userId), inArray(b.id, beansIds)),
    columns: { id: true },
  });
  const ownedIds = new Set(ownedBeans.map((bean) => bean.id));
  if (beansIds.some((beansId) => !ownedIds.has(beansId))) {
    throw new Error(
      "One or more selected beans do not belong to the current user",
    );
  }
};

const getTastingSetupBeansIds = (data: TastingSetupFormInputs): string[] =>
  [
    ...(data.beansId ? [data.beansId] : []),
    ...data.samples
      .map((sample) => sample.variableValueBeansId)
      .filter((beansId): beansId is string => Boolean(beansId)),
  ];

const toTastingSetupValues = (data: TastingSetupFormInputs) => {
  const variable = data.variable!;

  return {
    date: data.date,
    variable,
    note: nullableText(data.note),
    beansId: variable === TastingVariable.Beans ? null : data.beansId,
    method: variable === TastingVariable.Method ? null : nullableText(data.method),
    waterWeight: sanitizeNullableNumber(data.waterWeight),
    beansWeight: sanitizeNullableNumber(data.beansWeight),
    waterTemperature: sanitizeNullableNumber(data.waterTemperature),
    grinder: variable === TastingVariable.Grinder ? null : nullableText(data.grinder),
    grindSetting: nullableText(data.grindSetting),
    waterType: variable === TastingVariable.WaterType ? null : nullableText(data.waterType),
    filterType: variable === TastingVariable.FilterType ? null : nullableText(data.filterType),
    targetTimeMinutes: sanitizeNullableNumber(data.targetTimeMinutes),
    targetTimeSeconds: sanitizeNullableNumber(data.targetTimeSeconds),
  };
};

const toTastingSampleInsertValues = ({
  tastingId,
  variable,
  sample,
  position,
}: {
  tastingId: string;
  variable: TastingVariable;
  sample: TastingSetupFormInputs["samples"][number];
  position: number;
}) => ({
  tastingId,
  position,
  variableValueBeansId: variable === TastingVariable.Beans ? sample.variableValueBeansId : null,
  variableValueText:
    variable === TastingVariable.Beans ? null : nullableText(sample.variableValueText),
  note: nullableText(sample.note),
});

type DbTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const syncTastingSetupSamples = async ({
  tx,
  tastingId,
  variable,
  samples,
}: {
  tx: DbTx;
  tastingId: string;
  variable: TastingVariable;
  samples: TastingSetupFormInputs["samples"];
}): Promise<void> => {
  const existingSamples = await tx
    .select({ id: tastingSamples.id })
    .from(tastingSamples)
    .where(eq(tastingSamples.tastingId, tastingId));

  const existingSampleIds = new Set(existingSamples.map((sample) => sample.id));
  const incomingExistingSampleIds = samples
    .map((sample) => sample.id)
    .filter((sampleId): sampleId is string => Boolean(sampleId));

  if (incomingExistingSampleIds.some((sampleId) => !existingSampleIds.has(sampleId))) {
    throw new Error("One or more sample IDs are invalid");
  }

  if (existingSamples.length > 0) {
    // Temporary offset avoids unique constraint collisions while reordering.
    await tx
      .update(tastingSamples)
      .set({
        position: sql`${tastingSamples.position} + 10000`,
      })
      .where(eq(tastingSamples.tastingId, tastingId));
  }

  const incomingExistingSampleIdsSet = new Set(incomingExistingSampleIds);
  const sampleIdsToDelete = existingSamples
    .filter((sample) => !incomingExistingSampleIdsSet.has(sample.id))
    .map((sample) => sample.id);

  if (sampleIdsToDelete.length > 0) {
    await tx
      .delete(tastingSamples)
      .where(
        and(
          eq(tastingSamples.tastingId, tastingId),
          inArray(tastingSamples.id, sampleIdsToDelete),
        ),
      );
  }

  for (const [index, sample] of samples.entries()) {
    if (sample.id) {
      await tx
        .update(tastingSamples)
        .set({
          position: index,
          note: nullableText(sample.note),
        })
        .where(and(eq(tastingSamples.id, sample.id), eq(tastingSamples.tastingId, tastingId)));
      continue;
    }

    await tx.insert(tastingSamples).values(
      toTastingSampleInsertValues({
        tastingId,
        variable,
        sample,
        position: index,
      }),
    );
  }
};

export const addTasting = createServerFn({ method: "POST" })
  .inputValidator((input: { data: TastingSetupFormInputs }) => {
    validateTastingInput(input.data);
    return input;
  })
  .handler(async ({ data: { data }, context }): Promise<{ id: string }> => {
    const variable = data.variable!;
    const allBeansIds = getTastingSetupBeansIds(data);
    const tastingValues = toTastingSetupValues(data);
    await assertOwnedBeansIds(context.userId, allBeansIds);

    return db.transaction(async (tx) => {
      const [insertedTasting] = await tx
        .insert(tastings)
        .values({
          userId: context.userId,
          ...tastingValues,
        })
        .returning({ id: tastings.id });

      await tx.insert(tastingSamples).values(
        data.samples.map((sample, index) =>
          toTastingSampleInsertValues({
            tastingId: insertedTasting.id,
            variable,
            sample,
            position: index,
          }),
        ),
      );

      return { id: insertedTasting.id };
    });
  });

export const updateTastingSetup = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { tastingId: string; data: TastingSetupFormInputs }) => {
      if (!input.tastingId) {
        throw new Error("Tasting ID is required");
      }
      validateTastingInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { tastingId, data }, context }): Promise<void> => {
    const tasting = await db.query.tastings.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.id, tastingId), eq(t.userId, context.userId)),
      columns: {
        id: true,
        variable: true,
      },
    });

    if (!tasting) {
      throw new Error("Tasting not found");
    }

    if (tasting.variable !== data.variable) {
      throw new Error("Tasting variable cannot be changed");
    }

    const variable = data.variable!;
    const allBeansIds = getTastingSetupBeansIds(data);
    const tastingValues = toTastingSetupValues(data);
    await assertOwnedBeansIds(context.userId, allBeansIds);

    await db.transaction(async (tx) => {
      await tx
        .update(tastings)
        .set(tastingValues)
        .where(
          and(eq(tastings.id, tastingId), eq(tastings.userId, context.userId)),
        );

      await syncTastingSetupSamples({
        tx,
        tastingId,
        variable,
        samples: data.samples,
      });
    });
  });

export const updateTastingScoring = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { tastingId: string; data: TastingScoringFormInputs }) => {
      if (!input.tastingId) {
        throw new Error("Tasting ID is required");
      }
      if (input.data.samples.length === 0) {
        throw new Error("At least one sample is required");
      }
      return input;
    },
  )
  .handler(async ({ data: { tastingId, data }, context }): Promise<void> => {
    const tasting = await db.query.tastings.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.id, tastingId), eq(t.userId, context.userId)),
      columns: { id: true },
    });

    if (!tasting) {
      throw new Error("Tasting not found");
    }

    const sampleIds = data.samples.map((sample) => sample.id);
    const existingSamples = await db.query.tastingSamples.findMany({
      where: (sample, { and, eq, inArray }) =>
        and(eq(sample.tastingId, tastingId), inArray(sample.id, sampleIds)),
      columns: { id: true },
    });

    if (existingSamples.length !== data.samples.length) {
      throw new Error("One or more sample IDs are invalid");
    }

    await db.transaction(async (tx) => {
      for (const sample of data.samples) {
        await tx
          .update(tastingSamples)
          .set({
            note: nullableText(sample.note),
            actualTimeMinutes: sanitizeNullableNumber(sample.actualTimeMinutes),
            actualTimeSeconds: sanitizeNullableNumber(sample.actualTimeSeconds),
            overall: sanitizeNullableNumber(sample.overall),
            flavours: sample.flavours ?? [],
            aromaQuantity: sanitizeNullableNumber(sample.aromaQuantity),
            aromaQuality: sanitizeNullableNumber(sample.aromaQuality),
            aromaNotes: nullableText(sample.aromaNotes),
            acidityQuantity: sanitizeNullableNumber(sample.acidityQuantity),
            acidityQuality: sanitizeNullableNumber(sample.acidityQuality),
            acidityNotes: nullableText(sample.acidityNotes),
            sweetnessQuantity: sanitizeNullableNumber(sample.sweetnessQuantity),
            sweetnessQuality: sanitizeNullableNumber(sample.sweetnessQuality),
            sweetnessNotes: nullableText(sample.sweetnessNotes),
            bodyQuantity: sanitizeNullableNumber(sample.bodyQuantity),
            bodyQuality: sanitizeNullableNumber(sample.bodyQuality),
            bodyNotes: nullableText(sample.bodyNotes),
            finishQuantity: sanitizeNullableNumber(sample.finishQuantity),
            finishQuality: sanitizeNullableNumber(sample.finishQuality),
            finishNotes: nullableText(sample.finishNotes),
          })
          .where(
            and(
              eq(tastingSamples.id, sample.id),
              eq(tastingSamples.tastingId, tastingId),
            ),
          );
      }
    });
  });
