import { beans, brews, espresso, tastings, users } from "./schema";

// Base table types - inferred from schema
export type Brew = typeof brews.$inferSelect;
export type Espresso = typeof espresso.$inferSelect;
export type Beans = typeof beans.$inferSelect;
export type Tasting = typeof tastings.$inferSelect;
export type User = typeof users.$inferSelect;
