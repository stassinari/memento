import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// eslint-disable-next-line
export const db = drizzle(process.env.DATABASE_URL!, { schema });
