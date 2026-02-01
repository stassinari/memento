import { beans, brews, espresso } from "./schema";

export type Brew = typeof brews.$inferSelect;
export type Espresso = typeof espresso.$inferSelect;
export type Beans = typeof beans.$inferSelect;
