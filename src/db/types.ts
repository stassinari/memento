import { beans, brews, espresso, tastingSamples, tastings, users } from "./schema";

// Base table types - inferred from schema
export type Brew = typeof brews.$inferSelect;
export type Espresso = typeof espresso.$inferSelect;
export type Beans = typeof beans.$inferSelect;
export type Tasting = typeof tastings.$inferSelect;
export type TastingSample = typeof tastingSamples.$inferSelect;
export type User = typeof users.$inferSelect;

// A bean enriched with its query-time activity aggregate. Powers the Beans list
// surfaces (Open/Frozen rows, History table) where every row needs an average
// score without an N+1 fetch of each bean's drinks. `avgScore` is the mean of
// *rated* brews/espressos/tasting-samples (matching `getActivitySummary`), null
// when nothing is rated; `ratedCount` is how many scores fed that mean.
export type BeansListItem = Beans & {
  avgScore: number | null;
  ratedCount: number;
};
