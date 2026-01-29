import type { Handler } from "@netlify/functions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { featureFlags } from "../../src/db/schema";

const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle(queryClient, { schema: { featureFlags } });

export const handler: Handler = async () => {
  try {
    const results = await db.select().from(featureFlags);

    const flags: Record<string, boolean> = {};
    for (const flag of results) {
      flags[flag.name] = flag.enabled;
    }

    const response = {
      read_from_postgres: flags["read_from_postgres"] ?? false,
      write_to_postgres: flags["write_to_postgres"] ?? false,
      write_to_firestore: flags["write_to_firestore"] ?? true,
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
