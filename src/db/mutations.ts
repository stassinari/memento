import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { BeansFormInputs } from "~/components/beans/BeansForm";
import { db } from "./db";
import { beans, featureFlags, users } from "./schema";
import { randomBytes } from "crypto";

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
 * Convert Date to Firestore Timestamp
 */
function dateToTimestamp(date: Date | null): Timestamp | null {
  return date ? Timestamp.fromDate(date) : null;
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

export const changeFeatureFlag = createServerFn({
  method: "POST",
})
  .inputValidator((data: { name: string; enabled: boolean }) => {
    if (!data || !data.name || typeof data.enabled !== "boolean") {
      throw new Error("Name and enabled status are required");
    }
    return data;
  })
  .handler(async ({ data }): Promise<void> => {
    try {
      const { name, enabled } = data;

      await db
        .update(featureFlags)
        .set({ enabled })
        .where(eq(featureFlags.name, name));
    } catch (error) {
      console.error("Database error:", error);
      throw error;
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
  .handler(
    async ({ data: { data, firebaseUid } }): Promise<{ id: string }> => {
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
              varietals:
                data.origin === "single-origin" ? data.varietals : [],
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
    },
  );

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
    async ({
      data: { data, beansFbId, firebaseUid },
    }): Promise<void> => {
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
              varietals:
                data.origin === "single-origin" ? data.varietals : [],
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
