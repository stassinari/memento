import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export enum RoastStyle {
  Filter = "filter",
  Espresso = "espresso",
  OmniRoast = "omni-roast",
}

export const roastStyleEnum = pgEnum("roast_style", RoastStyle);

export enum BeanOrigin {
  SingleOrigin = "single-origin",
  Blend = "blend",
}

export const beanOriginEnum = pgEnum("bean_origin", BeanOrigin);
export enum ExtractionType {
  Percolation = "percolation",
  Immersion = "immersion",
}

export const extractionTypeEnum = pgEnum("extraction_type", ExtractionType);

export type BeansBlendPart = {
  name: string | null;
  country: string | null;
  varietals: string[];
  percentage: number | null;
  process: string | null;
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fbId: text("fb_id"),
    secretKey: text("secret_key"),
  },
  (table) => [uniqueIndex("users_fb_id_unique").on(table.fbId)],
);

export const beans = pgTable(
  "beans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fbId: text("fb_id"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    roaster: text("roaster").notNull(),
    roastDate: date("roast_date", { mode: "date" }),
    roastStyle: roastStyleEnum("roast_style"),
    roastLevel: integer("roast_level"),
    roastingNotes: text("roasting_notes")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    freezeDate: date("freeze_date", { mode: "date" }),
    thawDate: date("thaw_date", { mode: "date" }),
    isFinished: boolean("is_finished").notNull().default(false),

    origin: beanOriginEnum("origin").notNull(),

    country: text("country"),
    region: text("region"),
    varietals: text("varietals")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    altitude: integer("altitude"),
    process: text("process"),
    farmer: text("farmer"),
    harvestDate: date("harvest_date", { mode: "date" }),

    blendParts: jsonb("blend_parts").$type<BeansBlendPart[]>(),
  },
  (table) => [
    uniqueIndex("beans_fb_id_unique").on(table.fbId),
    index("beans_user_roast_date_idx").on(table.userId, table.roastDate),
    check(
      "beans_blend_parts_check",
      sql`${table.origin} <> 'blend' or (${table.blendParts} is not null and jsonb_typeof(${table.blendParts}) = 'array')`,
    ),
    check(
      "beans_blend_parts_single_origin_check",
      sql`${table.origin} <> 'single-origin' or ${table.blendParts} is null`,
    ),
  ],
);

export const brews = pgTable(
  "brews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fbId: text("fb_id"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    beansId: uuid("beans_id")
      .notNull()
      .references(() => beans.id, { onDelete: "restrict" }),

    date: timestamp("date", { withTimezone: true, mode: "date" }).notNull(),
    method: text("method").notNull(),

    grinder: text("grinder"),
    grinderBurrs: text("grinder_burrs"),
    waterType: text("water_type"),
    filterType: text("filter_type"),

    waterWeight: numeric("water_weight", { mode: "number" }).notNull(),
    beansWeight: numeric("beans_weight", { mode: "number" }).notNull(),
    waterTemperature: numeric("water_temperature", { mode: "number" }),
    grindSetting: text("grind_setting"),

    timeMinutes: integer("time_minutes"),
    timeSeconds: integer("time_seconds"),

    rating: numeric("rating", { precision: 3, scale: 1, mode: "number" }),
    notes: text("notes"),
    tds: numeric("tds", { mode: "number" }),
    finalBrewWeight: numeric("final_brew_weight", { mode: "number" }),
    extractionType: extractionTypeEnum("extraction_type"),

    aroma: numeric("aroma", { mode: "number" }),
    acidity: numeric("acidity", { mode: "number" }),
    sweetness: numeric("sweetness", { mode: "number" }),
    body: numeric("body", { mode: "number" }),
    finish: numeric("finish", { mode: "number" }),
  },
  (table) => [
    uniqueIndex("brews_fb_id_unique").on(table.fbId),
    index("brews_user_date_idx").on(table.userId, table.date),
    index("brews_beans_idx").on(table.beansId),
  ],
);

export const espresso = pgTable(
  "espresso",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fbId: text("fb_id"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    beansId: uuid("beans_id").references(() => beans.id, {
      onDelete: "restrict",
    }),

    date: timestamp("date", { withTimezone: true, mode: "date" }).notNull(),

    grindSetting: text("grind_setting"),
    machine: text("machine"),
    grinder: text("grinder"),
    grinderBurrs: text("grinder_burrs"),
    portafilter: text("portafilter"),
    basket: text("basket"),

    actualTime: numeric("actual_time", { mode: "number" }).notNull(),

    targetWeight: numeric("target_weight", { mode: "number" }),
    beansWeight: numeric("beans_weight", { mode: "number" }),
    waterTemperature: numeric("water_temperature", { mode: "number" }),
    actualWeight: numeric("actual_weight", { mode: "number" }),

    fromDecent: boolean("from_decent").notNull().default(false),
    partial: boolean("partial"),
    profileName: text("profile_name"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: "date" }),

    rating: numeric("rating", { precision: 3, scale: 1, mode: "number" }),
    notes: text("notes"),
    tds: numeric("tds", { mode: "number" }),

    aroma: numeric("aroma", { mode: "number" }),
    acidity: numeric("acidity", { mode: "number" }),
    sweetness: numeric("sweetness", { mode: "number" }),
    body: numeric("body", { mode: "number" }),
    finish: numeric("finish", { mode: "number" }),
  },
  (table) => [
    uniqueIndex("espresso_fb_id_unique").on(table.fbId),
    index("espresso_user_date_idx").on(table.userId, table.date),
    index("espresso_beans_idx").on(table.beansId),
    check(
      "espresso_manual_required_fields_check",
      sql`${table.fromDecent} = true or (${table.beansId} is not null and ${table.targetWeight} is not null and ${table.beansWeight} is not null)`,
    ),
    check(
      "espresso_decent_required_fields_check",
      sql`${table.fromDecent} = false or (${table.profileName} is not null and ${table.uploadedAt} is not null and ${table.actualWeight} is not null)`,
    ),
  ],
);

export const espressoDecentReadings = pgTable("espresso_decent_readings", {
  espressoId: uuid("espresso_id")
    .primaryKey()
    .references(() => espresso.id, { onDelete: "cascade" }),
  time: jsonb("time").$type<number[]>().notNull(),
  pressure: jsonb("pressure").$type<number[]>().notNull(),
  weightTotal: jsonb("weight_total").$type<number[]>().notNull(),
  flow: jsonb("flow").$type<number[]>().notNull(),
  weightFlow: jsonb("weight_flow").$type<number[]>().notNull(),
  temperatureBasket: jsonb("temperature_basket").$type<number[]>().notNull(),
  temperatureMix: jsonb("temperature_mix").$type<number[]>().notNull(),
  pressureGoal: jsonb("pressure_goal").$type<number[]>().notNull(),
  temperatureGoal: jsonb("temperature_goal").$type<number[]>().notNull(),
  flowGoal: jsonb("flow_goal").$type<number[]>().notNull(),
});

export const tastings = pgTable(
  "tastings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fbId: text("fb_id"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    beansId: uuid("beans_id").references(() => beans.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }),
    data: jsonb("data").notNull(),
  },
  (table) => [
    uniqueIndex("tastings_fb_id_unique").on(table.fbId),
    index("tastings_user_created_at_idx").on(table.userId, table.createdAt),
  ],
);

export const featureFlags = pgTable("feature_flags", {
  name: text("name").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  description: text("description"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  beans: many(beans),
  brews: many(brews),
  espresso: many(espresso),
  tastings: many(tastings),
}));

export const beansRelations = relations(beans, ({ one, many }) => ({
  user: one(users, {
    fields: [beans.userId],
    references: [users.id],
  }),
  brews: many(brews),
  espresso: many(espresso),
  tastings: many(tastings),
}));

export const brewsRelations = relations(brews, ({ one }) => ({
  user: one(users, {
    fields: [brews.userId],
    references: [users.id],
  }),
  beans: one(beans, {
    fields: [brews.beansId],
    references: [beans.id],
  }),
}));

export const espressoRelations = relations(espresso, ({ one }) => ({
  user: one(users, {
    fields: [espresso.userId],
    references: [users.id],
  }),
  beans: one(beans, {
    fields: [espresso.beansId],
    references: [beans.id],
  }),
  decentReadings: one(espressoDecentReadings, {
    fields: [espresso.id],
    references: [espressoDecentReadings.espressoId],
  }),
}));

export const espressoDecentReadingsRelations = relations(
  espressoDecentReadings,
  ({ one }) => ({
    espresso: one(espresso, {
      fields: [espressoDecentReadings.espressoId],
      references: [espresso.id],
    }),
  }),
);

export const tastingsRelations = relations(tastings, ({ one }) => ({
  user: one(users, {
    fields: [tastings.userId],
    references: [users.id],
  }),
  beans: one(beans, {
    fields: [tastings.beansId],
    references: [beans.id],
  }),
}));
