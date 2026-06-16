import { BeanOrigin, RoastStyle } from "~/db/schema";
import { Beans, Brew, Espresso } from "~/db/types";

/** UTC-midnight date `n` days before today (storage form). */
export const daysAgo = (n: number): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - n));
};

export const makeBean = (overrides: Partial<Beans> = {}): Beans =>
  ({
    id: "bean-1",
    userId: "user-1",
    name: "Kieni AA",
    roaster: "Square Mile Coffee",
    roastDate: daysAgo(9),
    roastStyle: "filter",
    roastLevel: 2,
    roastingNotes: ["Blackcurrant", "Rhubarb", "Brown sugar"],
    origin: BeanOrigin.SingleOrigin,
    country: "Kenya",
    region: "Nyeri",
    varietals: ["SL28", "SL34", "Ruiru 11"],
    altitude: 1800,
    process: "Washed",
    farmer: "Kieni Factory",
    harvestDate: daysAgo(190),
    blendParts: null,
    freezeDate: null,
    thawDate: null,
    isArchived: false,
    archiveDate: null,
    isFrozen: false,
    isOpen: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Beans;

export const makeBrew = (overrides: Partial<Brew> = {}): Brew =>
  ({
    id: `brew-${Math.round(Math.abs(Math.sin(Number(overrides.rating ?? 0))) * 1e6)}`,
    method: "V60",
    beansWeight: 15,
    waterWeight: 250,
    rating: 8.5,
    date: daysAgo(1),
    ...overrides,
  }) as Brew;

export const makeEspresso = (overrides: Partial<Espresso> = {}): Espresso =>
  ({
    id: `esp-${Math.round(Math.abs(Math.cos(Number(overrides.rating ?? 0))) * 1e6)}`,
    profileName: "Filter 2.1",
    beansWeight: 18,
    targetWeight: 36,
    rating: 9,
    date: daysAgo(2),
    ...overrides,
  }) as Espresso;

export interface BeanWithDrinks extends Beans {
  brews: Brew[];
  espressos: Espresso[];
  sampledInTastings: {
    id: string;
    position: number;
    overall: number | null;
    flavours: string[];
    tasting: { id: string };
  }[];
}

export const makeBeanWithDrinks = (
  bean: Partial<Beans> = {},
  drinks: Partial<Pick<BeanWithDrinks, "brews" | "espressos" | "sampledInTastings">> = {},
): BeanWithDrinks => ({
  ...makeBean(bean),
  brews: drinks.brews ?? [
    makeBrew({ id: "brew-a", method: "V60", rating: 8.5, date: daysAgo(2) }),
    makeBrew({ id: "brew-b", method: "Aeropress Inverted Long Name", rating: 9, date: daysAgo(4) }),
    makeBrew({ id: "brew-c", method: "Kalita", rating: 8, date: daysAgo(6) }),
  ],
  espressos: drinks.espressos ?? [
    makeEspresso({ id: "esp-a", profileName: "Extractamundo Dos", rating: 8.5, date: daysAgo(1) }),
  ],
  sampledInTastings: drinks.sampledInTastings ?? [
    {
      id: "ts-1",
      position: 1,
      overall: 8,
      flavours: ["Blackcurrant", "Rhubarb"],
      tasting: { id: "t-1" },
    },
    { id: "ts-2", position: 0, overall: 7.5, flavours: ["Brown sugar"], tasting: { id: "t-1" } },
  ],
});

// --- Ready-made bean states -------------------------------------------------

export const openBean = makeBean();
export const frozenBean = makeBean({
  roastDate: daysAgo(32),
  freezeDate: daysAgo(25),
  isFrozen: true,
  isOpen: false,
});
export const thawedBean = makeBean({
  roastDate: daysAgo(32),
  freezeDate: daysAgo(25),
  thawDate: daysAgo(4),
  isFrozen: false,
  isOpen: true,
});
export const archivedBean = makeBean({
  name: "Nano Genji",
  roaster: "Drop Coffee",
  country: "Ethiopia",
  process: "Washed",
  roastDate: daysAgo(142),
  isArchived: true,
  archiveDate: daysAgo(100),
  isOpen: false,
});
// Full lifecycle history, then archived — roasted → frozen → thawed → archived.
export const archivedHistoryBean = makeBean({
  name: "Nano Genji",
  roaster: "Drop Coffee",
  country: "Ethiopia",
  process: "Washed",
  roastDate: daysAgo(400),
  freezeDate: daysAgo(380),
  thawDate: daysAgo(200),
  isArchived: true,
  archiveDate: daysAgo(120),
  isFrozen: false,
  isOpen: false,
});
export const noRoastDateBean = makeBean({ roastDate: null, country: null, process: null });
export const blendBean = makeBean({
  name: "Spring Espresso",
  roaster: "Workshop Coffee",
  origin: BeanOrigin.Blend,
  country: null,
  region: null,
  process: null,
  varietals: [],
  roastStyle: RoastStyle.Espresso,
  blendParts: [
    {
      name: null,
      country: "Brazil",
      process: "Natural",
      varietals: ["Yellow Bourbon"],
      percentage: 70,
    },
    { name: null, country: "Ethiopia", process: null, varietals: ["Heirloom"], percentage: 30 },
  ],
});
