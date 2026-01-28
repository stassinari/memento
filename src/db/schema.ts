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
  (table) => ({
    fbIdUnique: uniqueIndex("users_fb_id_unique").on(table.fbId),
  }),
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
  (table) => ({
    fbIdUnique: uniqueIndex("beans_fb_id_unique").on(table.fbId),
    byUserRoastDate: index("beans_user_roast_date_idx").on(
      table.userId,
      table.roastDate,
    ),
    blendPartsCheck: check(
      "beans_blend_parts_check",
      sql`${table.origin} <> 'blend' or (${table.blendParts} is not null and jsonb_typeof(${table.blendParts}) = 'array')`,
    ),
    blendPartsNullForSingleOrigin: check(
      "beans_blend_parts_single_origin_check",
      sql`${table.origin} <> 'single-origin' or ${table.blendParts} is null`,
    ),
  }),
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

    waterWeight: numeric("water_weight").notNull(),
    beansWeight: numeric("beans_weight").notNull(),
    waterTemperature: numeric("water_temperature"),
    grindSetting: text("grind_setting"),

    timeMinutes: integer("time_minutes"),
    timeSeconds: integer("time_seconds"),

    rating: numeric({ precision: 3, scale: 1 }),
    notes: text("notes"),
    tds: numeric("tds"),
    finalBrewWeight: numeric("final_brew_weight"),
    extractionType: extractionTypeEnum("extraction_type"),

    aroma: numeric("aroma"),
    acidity: numeric("acidity"),
    sweetness: numeric("sweetness"),
    body: numeric("body"),
    finish: numeric("finish"),
  },
  (table) => ({
    fbIdUnique: uniqueIndex("brews_fb_id_unique").on(table.fbId),
    byUserDate: index("brews_user_date_idx").on(table.userId, table.date),
    byBeans: index("brews_beans_idx").on(table.beansId),
  }),
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

    actualTime: numeric("actual_time").notNull(),

    targetWeight: numeric("target_weight"),
    beansWeight: numeric("beans_weight"),
    waterTemperature: numeric("water_temperature"),

    actualWeight: numeric("actual_weight"),

    fromDecent: boolean("from_decent").notNull().default(false),
    partial: boolean("partial"),
    profileName: text("profile_name"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: "date" }),

    rating: numeric({ precision: 3, scale: 1 }),
    notes: text("notes"),
    tds: numeric("tds"),

    aroma: numeric("aroma"),
    acidity: numeric("acidity"),
    sweetness: numeric("sweetness"),
    body: numeric("body"),
    finish: numeric("finish"),
  },
  (table) => ({
    fbIdUnique: uniqueIndex("espresso_fb_id_unique").on(table.fbId),
    byUserDate: index("espresso_user_date_idx").on(table.userId, table.date),
    byBeans: index("espresso_beans_idx").on(table.beansId),
    espressoManualRequiredFields: check(
      "espresso_manual_required_fields_check",
      sql`${table.fromDecent} = true or (${table.beansId} is not null and ${table.targetWeight} is not null and ${table.beansWeight} is not null)`,
    ),
    espressoDecentRequiredFields: check(
      "espresso_decent_required_fields_check",
      sql`${table.fromDecent} = false or (${table.profileName} is not null and ${table.uploadedAt} is not null and ${table.actualWeight} is not null)`,
    ),
  }),
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
  (table) => ({
    fbIdUnique: uniqueIndex("tastings_fb_id_unique").on(table.fbId),
    byUserCreatedAt: index("tastings_user_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
  }),
);
