import { createServerFn } from "@tanstack/react-start";
import { randomBytes } from "crypto";
import { and, eq } from "drizzle-orm";
import { BeansFormInputs } from "~/components/beans/BeansForm";
import { BrewFormInputs } from "~/components/brews/BrewForm";
import { EspressoFormInputs } from "~/components/espresso/EspressoForm";
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
 * Convert Date to SQL date string (YYYY-MM-DD)
 */
function dateToSqlDate(date: Date | null): string | null {
  return date ? date.toISOString().split("T")[0] : null;
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
    if (!data.blend || data.blend.length === 0) {
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
  .handler(async ({ data: { data, firebaseUid } }): Promise<{ id: string }> => {
    // 1. Get feature flags
    const flags = await getFlags();

    // 2. Generate Firestore-compatible doc ID
    const fbId = generateFirestoreId();

    // 3. CONDITIONAL WRITE TO POSTGRESQL
    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (!userId) {
          console.error(
            "User not found in PostgreSQL, skipping Postgres write",
          );
        } else {
          // Convert form data for PostgreSQL
          const pgData = {
            fbId,
            userId,
            name: data.name!,
            roaster: data.roaster!,
            roastDate: dateToSqlDate(data.roastDate),
            roastStyle: data.roastStyle,
            roastLevel: data.roastLevel,
            roastingNotes: data.roastingNotes,
            freezeDate: dateToSqlDate(data.freezeDate),
            thawDate: dateToSqlDate(data.thawDate),
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
              data.origin === "single-origin"
                ? dateToSqlDate(data.harvestDate)
                : null,
            // Blend parts (null if single-origin)
            blendParts: data.origin === "blend" ? data.blend : null,
          };

          await db.insert(beans).values(pgData);
        }
      } catch (error) {
        console.error("PostgreSQL insert failed:", error);
        // Log but continue (eventual consistency)
      }
    }

    // 4. Return ID for client-side Firestore write
    return { id: fbId };
  });

/**
 * Archive beans (set isFinished = true)
 */
export const archiveBeans = createServerFn({ method: "POST" })
  .inputValidator((input: { beansFbId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansFbId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansFbId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .update(beans)
            .set({ isFinished: true })
            .where(and(eq(beans.fbId, beansFbId), eq(beans.userId, userId)));
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
  .inputValidator((input: { beansFbId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansFbId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansFbId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .update(beans)
            .set({ isFinished: false })
            .where(and(eq(beans.fbId, beansFbId), eq(beans.userId, userId)));
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
  .inputValidator((input: { beansFbId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansFbId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansFbId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          const today = new Date().toISOString().split("T")[0];
          await db
            .update(beans)
            .set({ freezeDate: today })
            .where(and(eq(beans.fbId, beansFbId), eq(beans.userId, userId)));
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
  .inputValidator((input: { beansFbId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansFbId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansFbId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          const today = new Date().toISOString().split("T")[0];
          await db
            .update(beans)
            .set({ thawDate: today })
            .where(and(eq(beans.fbId, beansFbId), eq(beans.userId, userId)));
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
  .inputValidator((input: { beansFbId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.beansFbId) {
      throw new Error("Firebase UID and Beans ID are required");
    }
    return input;
  })
  .handler(async ({ data: { beansFbId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .delete(beans)
            .where(and(eq(beans.fbId, beansFbId), eq(beans.userId, userId)));
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
      beansFbId: string;
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.beansFbId) {
        throw new Error("Beans ID is required");
      }
      validateBeansInput(input.data);
      return input;
    },
  )
  .handler(
    async ({ data: { data, beansFbId, firebaseUid } }): Promise<void> => {
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
              roastDate: dateToSqlDate(data.roastDate),
              roastStyle: data.roastStyle,
              roastLevel: data.roastLevel,
              roastingNotes: data.roastingNotes,
              freezeDate: dateToSqlDate(data.freezeDate),
              thawDate: dateToSqlDate(data.thawDate),
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
                data.origin === "single-origin"
                  ? dateToSqlDate(data.harvestDate)
                  : null,
              // Blend parts (null if single-origin)
              blendParts: data.origin === "blend" ? data.blend : null,
            };

            await db
              .update(beans)
              .set(pgData)
              .where(and(eq(beans.fbId, beansFbId), eq(beans.userId, userId)));
          }
        } catch (error) {
          console.error("PostgreSQL update failed:", error);
          // Log but continue (eventual consistency)
        }
      }
    },
  );

// ============================================================================
// BREWS MUTATIONS
// ============================================================================

/**
 * Extract beans Firebase ID from Firestore path
 * Example: "users/abc123/beans/xyz789" -> "xyz789"
 */
function extractBeansFbId(beansPath: string | null): string | null {
  if (!beansPath) return null;
  const parts = beansPath.split("/");
  return parts[parts.length - 1] || null;
}

/**
 * Helper to resolve beans Firebase ID to PostgreSQL UUID
 * Returns null if beans not found
 */
async function getBeansIdByFbId(
  beansFbId: string | null,
  userId: string,
): Promise<string | null> {
  if (!beansFbId) return null;

  try {
    const [bean] = await db
      .select({ id: beans.id })
      .from(beans)
      .where(and(eq(beans.fbId, beansFbId), eq(beans.userId, userId)))
      .limit(1);

    if (!bean) {
      console.warn(
        `Beans with Firebase ID ${beansFbId} not found in PostgreSQL`,
      );
      return null;
    }

    return bean.id;
  } catch (error) {
    console.error("Failed to fetch beans by Firebase ID:", error);
    return null;
  }
}

/**
 * Validate brew input data
 */
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

/**
 * Add new brew with conditional dual-write to PostgreSQL and/or Firestore
 */
export const addBrew = createServerFn({ method: "POST" })
  .inputValidator((input: { data: BrewFormInputs; firebaseUid: string }) => {
    if (!input.firebaseUid) {
      throw new Error("Firebase UID is required");
    }
    validateBrewInput(input.data);
    return input;
  })
  .handler(async ({ data: { data, firebaseUid } }): Promise<{ id: string }> => {
    // 1. Get feature flags
    const flags = await getFlags();

    // 2. Generate Firestore-compatible doc ID
    const fbId = generateFirestoreId();

    // 3. CONDITIONAL WRITE TO POSTGRESQL
    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (!userId) {
          console.error(
            "User not found in PostgreSQL, skipping Postgres write",
          );
        } else {
          // Extract beansFbId and resolve to UUID
          const beansFbId = extractBeansFbId(data.beans);
          const beansId = await getBeansIdByFbId(beansFbId, userId);

          if (!beansId) {
            console.error(
              `Beans ${beansFbId} not found in PostgreSQL, skipping Postgres write`,
            );
          } else {
            // Convert form data for PostgreSQL
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

            await db.insert(brews).values(pgData);
          }
        }
      } catch (error) {
        console.error("PostgreSQL insert failed:", error);
        // Log but continue (eventual consistency)
      }
    }

    // 4. Return ID for client-side Firestore write
    return { id: fbId };
  });

/**
 * Update existing brew with conditional dual-write to PostgreSQL and/or Firestore
 */
export const updateBrew = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      data: BrewFormInputs;
      brewFbId: string;
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.brewFbId) {
        throw new Error("Brew ID is required");
      }
      validateBrewInput(input.data);
      return input;
    },
  )
  .handler(async ({ data: { data, brewFbId, firebaseUid } }): Promise<void> => {
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
          // Extract beansFbId and resolve to UUID
          const beansFbId = extractBeansFbId(data.beans);
          const beansId = await getBeansIdByFbId(beansFbId, userId);

          if (!beansId) {
            console.error(
              `Beans ${beansFbId} not found in PostgreSQL, skipping Postgres update`,
            );
          } else {
            // Convert form data for PostgreSQL
            const pgData = {
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
              // Note: outcome fields are NOT updated here (use updateBrewOutcome)
            };

            await db
              .update(brews)
              .set(pgData)
              .where(and(eq(brews.fbId, brewFbId), eq(brews.userId, userId)));
          }
        }
      } catch (error) {
        console.error("PostgreSQL update failed:", error);
        // Log but continue (eventual consistency)
      }
    }
  });

/**
 * Update brew outcome fields (partial update)
 */
export const updateBrewOutcome = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      data: {
        rating: number | null;
        notes: string | null;
        tds: number | null;
        finalBrewWeight: number | null;
        extractionType: "percolation" | "immersion" | null;
        tastingScores: {
          aroma: number | null;
          acidity: number | null;
          sweetness: number | null;
          body: number | null;
          finish: number | null;
        } | null;
      };
      brewFbId: string;
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.brewFbId) {
        throw new Error("Brew ID is required");
      }
      return input;
    },
  )
  .handler(async ({ data: { data, brewFbId, firebaseUid } }): Promise<void> => {
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
          // Flatten tasting scores for PostgreSQL
          const pgData = {
            rating: data.rating,
            notes: data.notes,
            tds: data.tds,
            finalBrewWeight: data.finalBrewWeight,
            extractionType: data.extractionType,
            // Flatten tasting scores
            aroma: data.tastingScores?.aroma ?? null,
            acidity: data.tastingScores?.acidity ?? null,
            sweetness: data.tastingScores?.sweetness ?? null,
            body: data.tastingScores?.body ?? null,
            finish: data.tastingScores?.finish ?? null,
          };

          await db
            .update(brews)
            .set(pgData)
            .where(and(eq(brews.fbId, brewFbId), eq(brews.userId, userId)));
        }
      } catch (error) {
        console.error("PostgreSQL outcome update failed:", error);
        // Log but continue (eventual consistency)
      }
    }
  });

/**
 * Delete brew
 */
export const deleteBrew = createServerFn({ method: "POST" })
  .inputValidator((input: { brewFbId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.brewFbId) {
      throw new Error("Firebase UID and Brew ID are required");
    }
    return input;
  })
  .handler(async ({ data: { brewFbId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .delete(brews)
            .where(and(eq(brews.fbId, brewFbId), eq(brews.userId, userId)));
        }
      } catch (error) {
        console.error("PostgreSQL delete failed:", error);
      }
    }
  });

// ============================================================================
// ESPRESSO MUTATIONS
// ============================================================================

/**
 * Validate espresso input data
 */
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
    // 1. Get feature flags
    const flags = await getFlags();

    // 2. Generate Firestore-compatible doc ID
    const fbId = generateFirestoreId();

    // 3. CONDITIONAL WRITE TO POSTGRESQL
    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (!userId) {
          console.error(
            "User not found in PostgreSQL, skipping Postgres write",
          );
        } else {
          // Extract beansFbId and resolve to UUID
          const beansFbId = extractBeansFbId(data.beans);
          const beansId = await getBeansIdByFbId(beansFbId, userId);

          if (!beansId) {
            console.error(
              `Beans ${beansFbId} not found in PostgreSQL, skipping Postgres write`,
            );
          } else {
            // Convert form data for PostgreSQL
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
              actualTime: data.actualTime ?? 0, // Default to 0 if not provided
              targetWeight: data.targetWeight ?? 0, // Default to 0 if not provided
              beansWeight: data.beansWeight ?? 0, // Default to 0 if not provided
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

            await db.insert(espresso).values(pgData);
          }
        }
      } catch (error) {
        console.error("PostgreSQL insert failed:", error);
        // Log but continue (eventual consistency)
      }
    }

    // 4. Return ID for client-side Firestore write
    return { id: fbId };
  });

/**
 * Update existing espresso with conditional dual-write to PostgreSQL and/or Firestore
 */
export const updateEspresso = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      data: EspressoFormInputs;
      espressoFbId: string;
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.espressoFbId) {
        throw new Error("Espresso ID is required");
      }
      validateEspressoInput(input.data);
      return input;
    },
  )
  .handler(
    async ({ data: { data, espressoFbId, firebaseUid } }): Promise<void> => {
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
            // Extract beansFbId and resolve to UUID
            const beansFbId = extractBeansFbId(data.beans);
            const beansId = await getBeansIdByFbId(beansFbId, userId);

            if (!beansId) {
              console.error(
                `Beans ${beansFbId} not found in PostgreSQL, skipping Postgres update`,
              );
            } else {
              // Convert form data for PostgreSQL
              const pgData = {
                beansId,
                date: data.date!,
                grindSetting: data.grindSetting,
                machine: data.machine,
                grinder: data.grinder,
                grinderBurrs: data.grinderBurrs,
                portafilter: data.portafilter,
                basket: data.basket,
                actualTime: data.actualTime!,
                targetWeight: data.targetWeight!,
                beansWeight: data.beansWeight!,
                waterTemperature: data.waterTemperature,
                actualWeight: data.actualWeight,
                // Note: outcome fields are NOT updated here (use updateEspressoOutcome)
              };

              await db
                .update(espresso)
                .set(pgData)
                .where(
                  and(
                    eq(espresso.fbId, espressoFbId),
                    eq(espresso.userId, userId),
                  ),
                );
            }
          }
        } catch (error) {
          console.error("PostgreSQL update failed:", error);
          // Log but continue (eventual consistency)
        }
      }
    },
  );

/**
 * Update espresso outcome fields (partial update)
 */
export const updateEspressoOutcome = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      data: {
        rating: number | null;
        notes: string | null;
        tds: number | null;
        tastingScores: {
          aroma: number | null;
          acidity: number | null;
          sweetness: number | null;
          body: number | null;
          finish: number | null;
        } | null;
      };
      espressoFbId: string;
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.espressoFbId) {
        throw new Error("Espresso ID is required");
      }
      return input;
    },
  )
  .handler(
    async ({ data: { data, espressoFbId, firebaseUid } }): Promise<void> => {
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
            // Flatten tasting scores for PostgreSQL
            const pgData = {
              rating: data.rating,
              notes: data.notes,
              tds: data.tds,
              // Flatten tasting scores
              aroma: data.tastingScores?.aroma ?? null,
              acidity: data.tastingScores?.acidity ?? null,
              sweetness: data.tastingScores?.sweetness ?? null,
              body: data.tastingScores?.body ?? null,
              finish: data.tastingScores?.finish ?? null,
            };

            await db
              .update(espresso)
              .set(pgData)
              .where(
                and(
                  eq(espresso.fbId, espressoFbId),
                  eq(espresso.userId, userId),
                ),
              );
          }
        } catch (error) {
          console.error("PostgreSQL outcome update failed:", error);
          // Log but continue (eventual consistency)
        }
      }
    },
  );

/**
 * Delete espresso
 */
export const deleteEspresso = createServerFn({ method: "POST" })
  .inputValidator((input: { espressoFbId: string; firebaseUid: string }) => {
    if (!input.firebaseUid || !input.espressoFbId) {
      throw new Error("Firebase UID and Espresso ID are required");
    }
    return input;
  })
  .handler(async ({ data: { espressoFbId, firebaseUid } }): Promise<void> => {
    const flags = await getFlags();

    if (flags.write_to_postgres) {
      try {
        const userId = await getUserByFirebaseUid(firebaseUid);
        if (userId) {
          await db
            .delete(espresso)
            .where(
              and(eq(espresso.fbId, espressoFbId), eq(espresso.userId, userId)),
            );
        }
      } catch (error) {
        console.error("PostgreSQL delete failed:", error);
      }
    }
  });

/**
 * Update Decent espresso partial details (add shot info)
 * Sets partial=false and adds beans + equipment details
 */
export const updateDecentEspressoDetails = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      data: {
        beans: string | null;
        grindSetting: string | null;
        machine: string | null;
        grinder: string | null;
        grinderBurrs: string | null;
        portafilter: string | null;
        basket: string | null;
        actualWeight: number;
        targetWeight: number | null;
        beansWeight: number | null;
      };
      espressoFbId: string;
      firebaseUid: string;
    }) => {
      if (!input.firebaseUid) {
        throw new Error("Firebase UID is required");
      }
      if (!input.espressoFbId) {
        throw new Error("Espresso ID is required");
      }
      return input;
    },
  )
  .handler(
    async ({ data: { data, espressoFbId, firebaseUid } }): Promise<void> => {
      const flags = await getFlags();

      // CONDITIONAL UPDATE TO POSTGRESQL
      if (flags.write_to_postgres) {
        try {
          const userId = await getUserByFirebaseUid(firebaseUid);
          if (!userId) {
            console.error(
              "User not found in PostgreSQL, skipping Postgres update",
            );
          } else {
            // Extract beansFbId and resolve to UUID
            const beansFbId = extractBeansFbId(data.beans);
            const beansId = await getBeansIdByFbId(beansFbId, userId);

            if (!beansId) {
              console.error(
                `Beans ${beansFbId} not found in PostgreSQL, skipping Postgres update`,
              );
            } else {
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
                  and(
                    eq(espresso.fbId, espressoFbId),
                    eq(espresso.userId, userId),
                  ),
                );
            }
          }
        } catch (error) {
          console.error("PostgreSQL update failed:", error);
        }
      }
    },
  );
