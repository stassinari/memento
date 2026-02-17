import { beans, brews, espresso, users } from "./schema";

// Base table types - inferred from schema
export type Brew = typeof brews.$inferSelect;
export type Espresso = typeof espresso.$inferSelect;
export type Beans = typeof beans.$inferSelect;
export type User = typeof users.$inferSelect;
