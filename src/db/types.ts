import { beans, brews, espresso, users } from "./schema";

export type Brew = typeof brews.$inferSelect;
export type Espresso = typeof espresso.$inferSelect;
export type Beans = typeof beans.$inferSelect;
export type User = typeof users.$inferSelect;

// Query result types with joins
export type BrewWithBeans = {
  brews: Brew;
  beans: Beans;
  users: User;
};

export type EspressoWithBeans = {
  espresso: Espresso;
  beans: Beans | null;
  users: User;
};

export type BeansWithUser = {
  beans: Beans;
  users: User;
};

export type BeanWithRelations = BeansWithUser & {
  brews: Brew[];
  espressos: Espresso[];
};
