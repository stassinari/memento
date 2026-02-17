import { createFileRoute } from "@tanstack/react-router";

/**
 * @deprecated: This route is no longer used in the current migration strategy.
 * It now returns hardcoded flags for compatibility reasons.
 *
 * API endpoint to return system-wide feature flags
 * Used by Firebase Functions to determine write behavior during migration
 *
 * Security: Protected by API key in Authorization header
 * Expected header: Authorization: Bearer <API_KEY>
 */
export const Route = createFileRoute("/api/feature-flags")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({
            write_to_postgres: true,
            write_to_firestore: false,
            read_from_postgres: true,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
