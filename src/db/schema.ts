import { sql } from "drizzle-orm";
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

export const roastStyleEnum = pgEnum("roast_style", [
  "filter",
  "espresso",
  "omni-roast",
]);
export const beanOriginEnum = pgEnum("bean_origin", ["single-origin", "blend"]);
export const extractionTypeEnum = pgEnum("extraction_type", [
  "percolation",
  "immersion",
]);

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
    roastDate: date("roast_date"),
    roastStyle: roastStyleEnum("roast_style"),
    roastLevel: integer("roast_level"),
    roastingNotes: text("roasting_notes")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    freezeDate: date("freeze_date"),
    thawDate: date("thaw_date"),
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
    harvestDate: date("harvest_date"),

    blendParts: jsonb("blend_parts"),
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
  time: jsonb("time").notNull(),
  pressure: jsonb("pressure").notNull(),
  weightTotal: jsonb("weight_total").notNull(),
  flow: jsonb("flow").notNull(),
  weightFlow: jsonb("weight_flow").notNull(),
  temperatureBasket: jsonb("temperature_basket").notNull(),
  temperatureMix: jsonb("temperature_mix").notNull(),
  pressureGoal: jsonb("pressure_goal").notNull(),
  temperatureGoal: jsonb("temperature_goal").notNull(),
  flowGoal: jsonb("flow_goal").notNull(),
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
