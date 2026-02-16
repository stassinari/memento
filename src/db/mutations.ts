import { createServerFn } from "@tanstack/react-start";
import { randomBytes } from "crypto";
import { and, eq } from "drizzle-orm";
import { BeansFormInputs } from "~/components/beans/BeansForm";
import { BrewFormInputs } from "~/components/brews/BrewForm";
import { BrewOutcomeInputs } from "~/components/brews/BrewOutcomeForm";
import { EspressoFormInputs } from "~/components/espresso/EspressoForm";
import { EspressoOutcomeInputs } from "~/components/espresso/EspressoOutcomeForm";
import { DecentEspressoFormInputs } from "~/components/espresso/steps/DecentEspressoForm";
import { db } from "./db";
import { beans, brews, espresso, featureFlags, users } from "./schema";

/**
 * Generate a Firestore-compatible document ID (20 character alphanumeric)
 * Mimics Firestore's auto-generated IDs
 */
function generateFirestoreId(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(20);
  let result = "";
  for (let i = 0; i < 20; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

/**
 * Helper to fetch feature flags from PostgreSQL
 * Returns flag values with safe defaults if query fails
 */
async function getFlags(): Promise<{
  write_to_postgres: boolean;
  write_to_firestore: boolean;
  read_from_postgres: boolean;
}> {
  try {
    const flagsResult = await db
      .select({ name: featureFlags.name, enabled: featureFlags.enabled })
      .from(featureFlags);

    const flags = flagsResult.reduce(
      (acc, flag) => {
        acc[flag.name] = flag.enabled;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    return {
      write_to_postgres: flags.write_to_postgres ?? false,
      write_to_firestore: flags.write_to_firestore ?? true,
      read_from_postgres: flags.read_from_postgres ?? false,
    };
  } catch (error) {
    console.error("Failed to fetch feature flags, using defaults:", error);
    return {
      write_to_postgres: false,
      write_to_firestore: true,
      read_from_postgres: false,
    };
  }
}

/**
 * Helper to resolve Firebase UID to PostgreSQL user UUID
 * Returns null if user not found (allows graceful degradation)
 */
async function getUserByFirebaseUid(
  firebaseUid: string,
): Promise<string | null> {
  try {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.fbId, firebaseUid))
      .limit(1);

    if (!user) {
      console.warn(
        `User with Firebase UID ${firebaseUid} not found in PostgreSQL`,
      );
      return null;
    }

    return user.id;
  } catch (error) {
    console.error("Failed to fetch user by Firebase UID:", error);
    return null;
  }
}

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
  .inputValidator((input: { firebaseUid: string; secretKey: string }) => {
    if (!input.firebaseUid) {
      throw new Error("Firebase UID is required");
    }
    return input;
  })
  .handler(async ({ data }): Promise<{ secretKey: string }> => {
    const { firebaseUid, secretKey } = data;

    // Update user in PostgreSQL
    const userId = await getUserByFirebaseUid(firebaseUid);
    if (userId) {
      try {
        await db.update(users).set({ secretKey }).where(eq(users.id, userId));
        console.log(`Secret key generated for user ${userId}`);
      } catch (error) {
        console.error("Failed to update secret key in PostgreSQL:", error);
      }
    }

    return { secretKey };
  });

/**
 * Delete the secretKey for a user
 */
export const deleteSecretKey = createServerFn({ method: "POST" })
  .inputValidator((input: { firebaseUid: string }) => {
    if (!input.firebaseUid) {
      throw new Error("Firebase UID is required");
    }
    return input;
  })
  .handler(async ({ data }): Promise<void> => {
    const { firebaseUid } = data;

    // Update user in PostgreSQL
    const userId = await getUserByFirebaseUid(firebaseUid);
    if (userId) {
      try {
        await db
          .update(users)
          .set({ secretKey: null })
          .where(eq(users.id, userId));
        console.log(`Secret key deleted for user ${userId}`);
      } catch (error) {
        console.error("Failed to delete secret key in PostgreSQL:", error);
      }
    }
  });

/**
 * Add new beans with conditional dual-write to PostgreSQL and/or Firestore
 */
export const addBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { data: BeansFormInputs; firebaseUid: string }) => {
    if (!input.firebaseUid) {
      throw new Error("Firebase UID is required");
    }
    validateBeansInput(input.data);
    return input;
  })
  .handler(async ({ data: { data, firebaseUid } }) => {
    const fbId = generateFirestoreId();

    try {
      const userId = await getUserByFirebaseUid(firebaseUid);
      if (!userId) {
        throw new Error("User not found in PostgreSQL");
      }

      // TODO move to the Form component
      const pgData = {
        fbId,
        userId,
        name: data.name!, //FIXME
        roaster: data.roaster!, // FIXME
        roastDate: data.roastDate,
        roastStyle: data.roastStyle,
        roastLevel: data.roastLevel,
        roastingNotes: data.roastingNotes,
        freezeDate: data.freezeDate,
        thawDate: data.thawDate,
        isFinished: data.isFinished ?? false,
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
 * Archive beans (set isFinished = true)
 */
export const archiveBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .update(beans)
            .set({ isFinished: true })
            .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
        }
      } catch (error) {
        console.error("PostgreSQL archive failed:", error);
      }
    }
  });

/**
 * Unarchive beans (set isFinished = false)
 */
export const unarchiveBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .update(beans)
            .set({ isFinished: false })
            .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
        }
      } catch (error) {
        console.error("PostgreSQL unarchive failed:", error);
      }
    }
  });

/**
 * Freeze beans (set freezeDate to current date)
 */
export const freezeBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .update(beans)
            .set({ freezeDate: new Date() })
            .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
        }
      } catch (error) {
        console.error("PostgreSQL freeze failed:", error);
      }
    }
  });

/**
 * Thaw beans (set thawDate to current date)
 */
export const thawBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .update(beans)
            .set({ thawDate: new Date() })
            .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
        }
      } catch (error) {
        console.error("PostgreSQL thaw failed:", error);
      }
    }
  });

/**
 * Delete beans
 */
export const deleteBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .delete(beans)
            .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
        }
      } catch (error) {
        console.error("PostgreSQL delete failed:", error);
      }
    }
  });

/**
 * Update existing beans with conditional dual-write to PostgreSQL and/or Firestore
 */
export const updateBeans = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      data: BeansFormInputs;
      beansId: string;
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.beansId) {
        throw new Error("Beans ID is required");
      }
      validateBeansInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { data, beansId, firebaseUid } }): Promise<void> => {
    // 1. Get feature flags
    const flags = await getFlags();

    // 2. CONDITIONAL UPDATE TO POSTGRESQL
    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (!userId) {
          console.error(
            "User not found in PostgreSQL, skipping Postgres update",
          );
        } else {
          // Convert form data for PostgreSQL
          const pgData = {
            name: data.name!,
            roaster: data.roaster!,
            roastDate: data.roastDate,
            roastStyle: data.roastStyle,
            roastLevel: data.roastLevel,
            roastingNotes: data.roastingNotes,
            freezeDate: data.freezeDate,
            thawDate: data.thawDate,
            isFinished: data.isFinished ?? false,
            origin: data.origin,
            // Single-origin fields (null if blend)
            country: data.origin === "single-origin" ? data.country : null,
            region: data.origin === "single-origin" ? data.region : null,
            varietals: data.origin === "single-origin" ? data.varietals : [],
            altitude: data.origin === "single-origin" ? data.altitude : null,
            process: data.origin === "single-origin" ? data.process : null,
            farmer: data.origin === "single-origin" ? data.farmer : null,
            harvestDate:
              data.origin === "single-origin" ? data.harvestDate : null,
            // Blend parts (null if single-origin)
            blendParts: data.origin === "blend" ? data.blendParts : null,
          };

          await db
            .update(beans)
            .set(pgData)
            .where(and(eq(beans.id, beansId), eq(beans.userId, userId)));
        }
      } catch (error) {
        console.error("PostgreSQL update failed:", error);
        // Log but continue (eventual consistency)
      }
    }
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
  .inputValidator((input: { data: BrewFormInputs; firebaseUid: string }) => {
    if (!input.firebaseUid) {
      throw new Error("Firebase UID is required");
    }
    validateBrewInput(input.data);
    return input;
  })
  .handler(async ({ data: { data, firebaseUid } }) => {
    const fbId = generateFirestoreId();

    try {
      const userId = await getUserByFirebaseUid(firebaseUid);
      const beansId = data.beans;
      if (!userId || !beansId) {
        throw new Error("User or beans not found");
      }
      const pgData = {
        fbId,
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
    (input: { data: BrewFormInputs; brewId: string; firebaseUid: string }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.brewId) {
        throw new Error("Brew ID is required");
      }
      validateBrewInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { data, brewId, firebaseUid } }) => {
    try {
      const userId = await getUserByFirebaseUid(firebaseUid);
      const beansId = data.beans;
      if (!userId || !beansId) {
        throw new Error("User or beans not found");
      }

      // TODO is this nice?
      // Convert null to undefined for Drizzle compatibility
      const updateData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === null ? undefined : value,
        ]),
      ) as Partial<typeof brews.$inferInsert>;

      await db
        .update(brews)
        .set(updateData)
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
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.brewId) {
        throw new Error("Brew ID is required");
      }
      return input;
    },
  )
  .handler(async ({ data: { data, brewId, firebaseUid } }): Promise<void> => {
    try {
      const userId = await getUserByFirebaseUid(firebaseUid);
      if (!userId) {
        throw new Error("User not found");
      }

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
  .inputValidator((input: { brewId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.brewId) {
      throw new Error("Firebase UID and Brew ID are required");
    }
    return input;
  })
  .handler(async ({ data: { brewId, firebaseUid } }): Promise<void> => {
    try {
      const userId = await getUserByFirebaseUid(firebaseUid);
      if (userId) {
        await db
          .delete(brews)
          .where(and(eq(brews.fbId, brewId), eq(brews.userId, userId)));
      }
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
 * Add new espresso with conditional dual-write to PostgreSQL and/or Firestore
 */
export const addEspresso = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { data: EspressoFormInputs; firebaseUid: string }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      validateEspressoInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { data, firebaseUid } }): Promise<{ id: string }> => {
    const fbId = generateFirestoreId();

    try {
      const userId = await getUserByFirebaseUid(firebaseUid);
      const beansId = data.beans;

      if (!userId || !beansId) {
        throw new Error("User or beans not found");
      }

      const pgData = {
        fbId,
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
      // Log but continue (eventual consistency)
    }

    // 4. Return ID for client-side Firestore write
    return { id: fbId };
  });

export const updateEspresso = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      data: EspressoFormInputs;
      espressoId: string;
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.espressoId) {
        throw new Error("Espresso ID is required");
      }
      validateEspressoInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { data, espressoId, firebaseUid } }) => {
    try {
      const userId = await getUserByFirebaseUid(firebaseUid);
      const beansId = data.beans;
      if (!userId || !beansId) {
        throw new Error("User or beans not found");
      }

      // TODO is this nice?
      // Convert null to undefined for Drizzle compatibility
      const updateData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === null ? undefined : value,
        ]),
      ) as Partial<typeof espresso.$inferInsert>;

      await db
        .update(espresso)
        .set(updateData)
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
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.espressoId) {
        throw new Error("Espresso ID is required");
      }
      return input;
    },
  )
  .handler(async ({ data: { data, espressoId, firebaseUid } }) => {
    try {
      const userId = await getUserByFirebaseUid(firebaseUid);
      if (!userId) {
        throw new Error("User not found");
      }

      await db
        .update(espresso)
        .set(data)
        .where(and(eq(espresso.id, espressoId), eq(espresso.userId, userId)));
    } catch (error) {
      console.error("PostgreSQL outcome update failed:", error);
      // Log but continue (eventual consistency)
    }
  });

/**
 * Delete espresso
 */
export const deleteEspresso = createServerFn({ method: "POST" })
  .inputValidator((input: { espressoId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.espressoId) {
      throw new Error("Firebase UID and Espresso ID are required");
    }
    return input;
  })
  .handler(async ({ data: { espressoId, firebaseUid } }): Promise<void> => {
    try {
      const userId = await getUserByFirebaseUid(firebaseUid);
      if (userId) {
        await db
          .delete(espresso)
          .where(
            and(eq(espresso.fbId, espressoId), eq(espresso.userId, userId)),
          );
      }
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
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.espressoId) {
        throw new Error("Espresso ID is required");
      }
      return input;
    },
  )
  .handler(
    async ({ data: { data, espressoId, firebaseUid } }): Promise<void> => {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        const beansId = data.beans;
        if (!userId) {
          throw new Error("User not found");
        }

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
