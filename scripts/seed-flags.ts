import "dotenv/config";
import { db } from "../src/db/db";
import { featureFlags } from "../src/db/schema";

async function seedFlags() {
  console.log("Seeding feature flags...");

  const flagsToSeed = [
    {
      name: "read_from_postgres",
      enabled: false,
      description: "Controls whether to read data from Postgres instead of Firestore",
    },
    {
      name: "write_to_postgres",
      enabled: false,
      description: "Enables writes to Postgres database",
    },
    {
      name: "write_to_firestore",
      enabled: true,
      description: "Keeps Firestore writes enabled (default)",
    },
  ];

  for (const flag of flagsToSeed) {
    await db
      .insert(featureFlags)
      .values(flag)
      .onConflictDoUpdate({
        target: featureFlags.name,
        set: { description: flag.description },
      });
  }

  console.log("Feature flags seeded successfully!");

  // Verify
  const flags = await db.select().from(featureFlags);
  console.log("\nCurrent flags:");
  console.table(flags);
}

seedFlags().catch(console.error);
