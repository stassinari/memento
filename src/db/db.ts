import { drizzle } from "drizzle-orm/node-postgres";

// eslint-disable-next-line
export const db = drizzle(process.env.DATABASE_URL!);
