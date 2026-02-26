import { relations, sql, SQL } from "drizzle-orm";
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

export enum TastingVariable {
  Beans = "beans",
  Method = "method",
  WaterType = "waterType",
  FilterType = "filterType",
  Grinder = "grinder",
}

export const tastingVariableEnum = pgEnum("tasting_variable", TastingVariable);

export type BeansBlendPart = {
  name: string | null;
  country: string | null;
  varietals: string[];
  percentage: number | null;
  process: string | null;
};

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fbId: text("fb_id"),
    secretKey: text("secret_key"),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_fb_id_unique").on(table.fbId)],
);

export const beans = pgTable(
  "beans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fbId: text("fb_id"),

    name: text("name").notNull(),
    roaster: text("roaster").notNull(),
    roastDate: date("roast_date", { mode: "date" }),
    roastStyle: roastStyleEnum("roast_style"),
    roastLevel: integer("roast_level"),
    roastingNotes: text("roasting_notes")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

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

    freezeDate: date("freeze_date", { mode: "date" }),
    thawDate: date("thaw_date", { mode: "date" }),
    isArchived: boolean("is_archived").notNull().default(false),

    isFrozen: boolean("is_frozen").generatedAlwaysAs(
      (): SQL =>
        sql`${beans.freezeDate} IS NOT NULL AND ${beans.thawDate} IS NULL`,
    ),
    isOpen: boolean("is_open").generatedAlwaysAs(
      (): SQL =>
        sql`${beans.isArchived} = false AND (${beans.freezeDate} IS NULL OR ${beans.thawDate} IS NOT NULL)`,
    ),

    ...timestamps,
  },
  (table) => [
    index("beans_user_roast_date_idx").on(table.userId, table.roastDate),
    uniqueIndex("beans_user_fb_id_unique")
      .on(table.userId, table.fbId)
      .where(sql`${table.fbId} is not null`),
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

    ...timestamps,
  },
  (table) => [
    index("brews_user_date_idx").on(table.userId, table.date),
    index("brews_beans_idx").on(table.beansId),
  ],
);

export const espresso = pgTable(
  "espresso",
  {
    id: uuid("id").primaryKey().defaultRandom(),
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

    ...timestamps,
  },
  (table) => [
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

  ...timestamps,
});

export const tastings = pgTable(
  "tastings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Normalized tasting fields (migration target)
    date: timestamp("date", { withTimezone: true, mode: "date" }),
    variable: tastingVariableEnum("variable"),
    note: text("note"),
    beansId: uuid("beans_id").references(() => beans.id, {
      onDelete: "restrict",
    }),
    method: text("method"),
    waterWeight: numeric("water_weight", { mode: "number" }),
    beansWeight: numeric("beans_weight", { mode: "number" }),
    waterTemperature: numeric("water_temperature", { mode: "number" }),
    grinder: text("grinder"),
    grindSetting: text("grind_setting"),
    waterType: text("water_type"),
    filterType: text("filter_type"),
    targetTimeMinutes: integer("target_time_minutes"),
    targetTimeSeconds: integer("target_time_seconds"),

    // Legacy payload kept temporarily during transition
    data: jsonb("data").$type<Record<string, {}>>().notNull(),

    ...timestamps,
  },
  (table) => [
    index("tastings_user_created_at_idx").on(table.userId, table.createdAt),
    index("tastings_user_date_idx").on(table.userId, table.date),
  ],
);

export const tastingSamples = pgTable(
  "tasting_samples",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tastingId: uuid("tasting_id")
      .notNull()
      .references(() => tastings.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),

    variableValueText: text("variable_value_text"),
    variableValueBeansId: uuid("variable_value_beans_id").references(
      () => beans.id,
      {
        onDelete: "restrict",
      },
    ),
    note: text("note"),
    actualTimeMinutes: integer("actual_time_minutes"),
    actualTimeSeconds: integer("actual_time_seconds"),

    overall: numeric("overall", { precision: 3, scale: 1, mode: "number" }),
    flavours: text("flavours")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    aromaQuantity: numeric("aroma_quantity", { mode: "number" }),
    aromaQuality: numeric("aroma_quality", { mode: "number" }),
    aromaNotes: text("aroma_notes"),

    acidityQuantity: numeric("acidity_quantity", { mode: "number" }),
    acidityQuality: numeric("acidity_quality", { mode: "number" }),
    acidityNotes: text("acidity_notes"),

    sweetnessQuantity: numeric("sweetness_quantity", { mode: "number" }),
    sweetnessQuality: numeric("sweetness_quality", { mode: "number" }),
    sweetnessNotes: text("sweetness_notes"),

    bodyQuantity: numeric("body_quantity", { mode: "number" }),
    bodyQuality: numeric("body_quality", { mode: "number" }),
    bodyNotes: text("body_notes"),

    finishQuantity: numeric("finish_quantity", { mode: "number" }),
    finishQuality: numeric("finish_quality", { mode: "number" }),
    finishNotes: text("finish_notes"),

    ...timestamps,
  },
  (table) => [
    index("tasting_samples_tasting_idx").on(table.tastingId),
    uniqueIndex("tasting_samples_tasting_position_unique").on(
      table.tastingId,
      table.position,
    ),
    check(
      "tasting_samples_variable_value_xor_check",
      sql`(${table.variableValueText} is null) <> (${table.variableValueBeansId} is null)`,
    ),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  beans: many(beans),
  brews: many(brews),
  espressos: many(espresso),
  tastings: many(tastings),
}));

export const beansRelations = relations(beans, ({ one, many }) => ({
  user: one(users, {
    fields: [beans.userId],
    references: [users.id],
  }),
  brews: many(brews),
  espressos: many(espresso),
  tastings: many(tastings),
  tastingSamples: many(tastingSamples),
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

export const tastingsRelations = relations(tastings, ({ one, many }) => ({
  user: one(users, {
    fields: [tastings.userId],
    references: [users.id],
  }),
  beans: one(beans, {
    fields: [tastings.beansId],
    references: [beans.id],
  }),
  samples: many(tastingSamples),
}));

export const tastingSamplesRelations = relations(tastingSamples, ({ one }) => ({
  tasting: one(tastings, {
    fields: [tastingSamples.tastingId],
    references: [tastings.id],
  }),
  variableValueBeans: one(beans, {
    fields: [tastingSamples.variableValueBeansId],
    references: [beans.id],
  }),
}));
