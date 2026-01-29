import { eq } from "drizzle-orm";
import { db } from "@/server/db/client.server";
import { featureFlags } from "@/db/schema";

export type FeatureFlagName =
  | "read_from_postgres"
  | "write_to_postgres"
  | "write_to_firestore";

export async function getFeatureFlag(
  name: FeatureFlagName,
): Promise<boolean> {
  const result = await db
    .select({ enabled: featureFlags.enabled })
    .from(featureFlags)
    .where(eq(featureFlags.name, name))
    .limit(1);

  return result[0]?.enabled ?? false;
}

export async function getAllFeatureFlags(): Promise<
  Record<FeatureFlagName, boolean>
> {
  const results = await db.select().from(featureFlags);

  const flags: Record<string, boolean> = {};
  for (const flag of results) {
    flags[flag.name] = flag.enabled;
  }

  return {
    read_from_postgres: flags["read_from_postgres"] ?? false,
    write_to_postgres: flags["write_to_postgres"] ?? false,
    write_to_firestore: flags["write_to_firestore"] ?? true,
  };
}
