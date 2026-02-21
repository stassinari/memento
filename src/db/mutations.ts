import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { BeansFormInputs } from "~/components/beans/BeansForm";
import { BrewFormInputs } from "~/components/brews/BrewForm";
import { BrewOutcomeInputs } from "~/components/brews/BrewOutcomeForm";
import { EspressoFormInputs } from "~/components/espresso/EspressoForm";
import { EspressoOutcomeInputs } from "~/components/espresso/EspressoOutcomeForm";
import { DecentEspressoFormInputs } from "~/components/espresso/steps/DecentEspressoForm";
import { db } from "./db";
import { beans, brews, espresso, users } from "./schema";

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
  .inputValidator((input: { userId: string; secretKey: string }) => {
    if (!input.userId) {
      throw new Error("User ID is required");
    }
    return input;
  })
  .handler(async ({ data }): Promise<{ secretKey: string }> => {
    const { userId, secretKey } = data;

    try {
      await db.update(users).set({ secretKey }).where(eq(users.id, userId));
    } catch (error) {
      console.error("Failed to update secret key:", error);
    }

    return { secretKey };
  });

/**
 * Delete the secretKey for a user
 */
export const deleteSecretKey = createServerFn({ method: "POST" })
  .inputValidator((input: { userId: string }) => {
    if (!input.userId) {
      throw new Error("User ID is required");
    }
    return input;
  })
  .handler(async ({ data }): Promise<void> => {
    const { userId } = data;

    try {
      await db
        .update(users)
        .set({ secretKey: null })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error("Failed to delete secret key:", error);
    }
  });

/**
 * Add new beans
 */
export const addBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { data: BeansFormInputs; userId: string }) => {
    if (!input.userId) {
      throw new Error("User ID is required");
    }
    validateBeansInput(input.data);
    return input;
  })
  .handler(async ({ data: { data, userId } }) => {
    try {
      // TODO move to the Form component
      const pgData = {
        userId,
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
  .inputValidator((input: { beansId: string; userId: string }) => {
    if (!input.userId || !input.beansId) {
      throw new Error("User ID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, userId } }): Promise<void> => {
    try {
      await db
        .update(beans)
        .set({ isArchived: true })
        .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
    } catch (error) {
      console.error("PostgreSQL archive failed:", error);
    }
  });

/**
 * Unarchive beans (set isArchived = false)
 */
export const unarchiveBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string; userId: string }) => {
    if (!input.userId || !input.beansId) {
      throw new Error("User ID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, userId } }): Promise<void> => {
    try {
      await db
        .update(beans)
        .set({ isArchived: false })
        .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
    } catch (error) {
      console.error("PostgreSQL unarchive failed:", error);
    }
  });

/**
 * Freeze beans (set freezeDate to current date)
 */
export const freezeBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string; userId: string }) => {
    if (!input.userId || !input.beansId) {
      throw new Error("User ID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, userId } }): Promise<void> => {
    try {
      await db
        .update(beans)
        .set({ freezeDate: new Date() })
        .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
    } catch (error) {
      console.error("PostgreSQL freeze failed:", error);
    }
  });

/**
 * Thaw beans (set thawDate to current date)
 */
export const thawBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string; userId: string }) => {
    if (!input.userId || !input.beansId) {
      throw new Error("User ID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, userId } }): Promise<void> => {
    try {
      await db
        .update(beans)
        .set({ thawDate: new Date() })
        .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
    } catch (error) {
      console.error("PostgreSQL thaw failed:", error);
    }
  });

/**
 * Delete beans
 */
export const deleteBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string; userId: string }) => {
    if (!input.userId || !input.beansId) {
      throw new Error("User ID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, userId } }) => {
    try {
      // check if beans have associated brews or espressos before deleting
      const hasDrinks = await db
        .select({ id: brews.id })
        .from(brews)
        .where(eq(brews.beansId, beansId))
        .union(
          db
            .select({ id: espresso.id })
            .from(espresso)
            .where(eq(espresso.beansId, beansId)),
        )
        .limit(1);

      if (hasDrinks.length > 0) {
        return false; // Cannot delete beans with associated brews or espressos
      }

      await db
        .delete(beans)
        .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));

      return true; // Deletion successful
    } catch (error) {
      console.error("PostgreSQL delete failed:", error);
    }
  });

/**
 * Update existing beans
 */
export const updateBeans = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      data: BeansFormInputs;
      beansId: string;
      userId: string;
    }) => {
      if (!input.userId) {
        throw new Error("User ID is required");
      }
      if (!input.beansId) {
        throw new Error("Beans ID is required");
      }
      validateBeansInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { data, beansId, userId } }): Promise<void> => {
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
      .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
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
  .inputValidator((input: { data: BrewFormInputs; userId: string }) => {
    if (!input.userId) {
      throw new Error("User ID is required");
    }
    validateBrewInput(input.data);
    return input;
  })
  .handler(async ({ data: { data, userId } }) => {
    try {
      const beansId = data.beans;
      if (!beansId) {
        throw new Error("Beans not found");
      }
      const pgData = {
        userId,
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
  .inputValidator(
    (input: { data: BrewFormInputs; brewId: string; userId: string }) => {
      if (!input.userId) {
        throw new Error("User ID is required");
      }
      if (!input.brewId) {
        throw new Error("Brew ID is required");
      }
      validateBrewInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { data, brewId, userId } }) => {
    try {
      const beansId = data.beans;
      if (!beansId) {
        throw new Error("Beans not found");
      }

      await db
        .update(brews)
        .set({ ...data, beansId } as Partial<typeof brews.$inferInsert>)
        .where(and(eq(brews.id, brewId), eq(brews.userId, userId)));

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
  .inputValidator(
    (input: {
      data: BrewOutcomeInputs;
      brewId: string;
      userId: string;
    }) => {
      if (!input.userId) {
        throw new Error("User ID is required");
      }
      if (!input.brewId) {
        throw new Error("Brew ID is required");
      }
      return input;
    },
  )
  .handler(async ({ data: { data, brewId, userId } }): Promise<void> => {
    try {
      await db
        .update(brews)
        .set(data)
        .where(and(eq(brews.id, brewId), eq(brews.userId, userId)));
    } catch (error) {
      console.error("Update brew outcome failed:", error);
      throw error;
    }
  });

/**
 * Delete brew
 */
export const deleteBrew = createServerFn({ method: "POST" })
  .inputValidator((input: { brewId: string; userId: string }) => {
    if (!input.userId || !input.brewId) {
      throw new Error("User ID and Brew ID are required");
    }
    return input;
  })
  .handler(async ({ data: { brewId, userId } }): Promise<void> => {
    try {
      await db
        .delete(brews)
        .where(and(eq(brews.id, brewId), eq(brews.userId, userId)));
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
  .inputValidator(
    (input: { data: EspressoFormInputs; userId: string }) => {
      if (!input.userId) {
        throw new Error("User ID is required");
      }
      validateEspressoInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { data, userId } }): Promise<{ id: string }> => {
    try {
      const beansId = data.beans;

      if (!beansId) {
        throw new Error("Beans not found");
      }

      const pgData = {
        userId,
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
  .inputValidator(
    (input: {
      data: EspressoFormInputs;
      espressoId: string;
      userId: string;
    }) => {
      if (!input.userId) {
        throw new Error("User ID is required");
      }
      if (!input.espressoId) {
        throw new Error("Espresso ID is required");
      }
      validateEspressoInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { data, espressoId, userId } }) => {
    try {
      const beansId = data.beans;
      if (!beansId) {
        throw new Error("Beans not found");
      }

      await db
        .update(espresso)
        .set({ ...data, beansId } as Partial<typeof espresso.$inferInsert>)
        .where(and(eq(espresso.id, espressoId), eq(espresso.userId, userId)));

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
    (input: {
      data: EspressoOutcomeInputs;
      espressoId: string;
      userId: string;
    }) => {
      if (!input.userId) {
        throw new Error("User ID is required");
      }
      if (!input.espressoId) {
        throw new Error("Espresso ID is required");
      }
      return input;
    },
  )
  .handler(async ({ data: { data, espressoId, userId } }) => {
    try {
      await db
        .update(espresso)
        .set(data)
        .where(and(eq(espresso.id, espressoId), eq(espresso.userId, userId)));
    } catch (error) {
      console.error("PostgreSQL outcome update failed:", error);
    }
  });

/**
 * Delete espresso
 */
export const deleteEspresso = createServerFn({ method: "POST" })
  .inputValidator((input: { espressoId: string; userId: string }) => {
    if (!input.userId || !input.espressoId) {
      throw new Error("User ID and Espresso ID are required");
    }
    return input;
  })
  .handler(async ({ data: { espressoId, userId } }): Promise<void> => {
    try {
      await db
        .delete(espresso)
        .where(and(eq(espresso.id, espressoId), eq(espresso.userId, userId)));
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
    (input: {
      data: DecentEspressoFormInputs;
      espressoId: string;
      userId: string;
    }) => {
      if (!input.userId) {
        throw new Error("User ID is required");
      }
      if (!input.espressoId) {
        throw new Error("Espresso ID is required");
      }
      return input;
    },
  )
  .handler(
    async ({ data: { data, espressoId, userId } }): Promise<void> => {
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
          .where(and(eq(espresso.id, espressoId), eq(espresso.userId, userId)));

        return;
      } catch (error) {
        console.error("PostgreSQL update failed:", error);
        throw error;
      }
    },
  );
