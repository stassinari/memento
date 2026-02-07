import { createFileRoute } from "@tanstack/react-router";
import { db } from "~/db/db";
import { featureFlags } from "~/db/schema";

/**
 * API endpoint to return system-wide feature flags
 * Used by Firebase Functions to determine write behavior during migration
 *
 * Security: Protected by API key in Authorization header
 * Expected header: Authorization: Bearer <API_KEY>
 */
export const Route = createFileRoute("/api/feature-flags")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Verify API key
        const authHeader = request.headers.get("Authorization");
        const expectedKey = process.env.FEATURE_FLAGS_API_KEY;

        if (!expectedKey) {
          console.error("FEATURE_FLAGS_API_KEY not configured");
          return new Response(
            JSON.stringify({ error: "Server misconfiguration" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        const providedKey = authHeader?.replace("Bearer ", "");
        if (!providedKey || providedKey !== expectedKey) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          );
        }

        // Fetch flags from PostgreSQL
        try {
          const flagsResult = await db
            .select({ name: featureFlags.name, enabled: featureFlags.enabled })
            .from(featureFlags);

          const flags = flagsResult.reduce(
            (acc, flag) => {
              acc[flag.name] = flag.enabled;
              return acc;
            },
            {} as Record<string, boolean>
          );

          return new Response(
            JSON.stringify({
              write_to_postgres: flags.write_to_postgres ?? false,
              write_to_firestore: flags.write_to_firestore ?? true,
              read_from_postgres: flags.read_from_postgres ?? false,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          console.error("Failed to fetch feature flags:", error);
          return new Response(
            JSON.stringify({ error: "Database error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
