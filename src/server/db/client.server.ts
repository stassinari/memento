import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Use regular postgres driver for both local and production
// When deploying to Neon, this works with their connection string
const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });
