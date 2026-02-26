import "dotenv/config";

import fs from "fs/promises";
import postgres from "postgres";

type TastingRow = {
  id: string;
  userId: string;
  createdAt: Date;
  data: unknown;
};

type BeansMapRow = {
  id: string;
  userId: string;
  fbId: string;
};

type TastingVariable =
  | "beans"
  | "method"
  | "waterType"
  | "filterType"
  | "grinder";

type TastingPrep = {
  beans: unknown;
  method: string;
  waterWeight: string;
  beansWeight: string;
  waterTemperature: string;
  grinder: string;
  grindSetting: string;
  waterType: string;
  filterType: string;
  timeMinutes: string;
  timeSeconds: string;
};

type TastingRating = {
  overall: number;
  flavours: string[];
  aromaQuantity: number;
  aromaQuality: number;
  aromaNotes: string;
  acidityQuantity: number;
  acidityQuality: number;
  acidityNotes: string;
  sweetnessQuantity: number;
  sweetnessQuality: number;
  sweetnessNotes: string;
  bodyQuantity: number;
  bodyQuality: number;
  bodyNotes: string;
  finishQuantity: number;
  finishQuality: number;
  finishNotes: string;
};

type TastingSample = {
  variableValue: unknown;
  note: string;
  prep: TastingPrep;
  rating: TastingRating;
};

type ParsedTasting = {
  rawVariable: string | null;
  variable: TastingVariable | null;
  date: Date | null;
  note: string;
  samples: TastingSample[];
};

type NormalizedSetup = {
  beansId: string | null;
  method: string | null;
  waterWeight: number | null;
  beansWeight: number | null;
  waterTemperature: number | null;
  grinder: string | null;
  grindSetting: string | null;
  waterType: string | null;
  filterType: string | null;
  targetTimeMinutes: number | null;
  targetTimeSeconds: number | null;
};

type PrepFieldKey =
  | "beans"
  | "method"
  | "waterWeight"
  | "beansWeight"
  | "waterTemperature"
  | "grinder"
  | "grindSetting"
  | "waterType"
  | "filterType"
  | "timeMinutes"
  | "timeSeconds";

type NormalizeSetupResult = {
  setup: NormalizedSetup;
  mixedFields: PrepFieldKey[];
};

type SampleInsert = {
  tastingId: string;
  position: number;
  variableValueText: string | null;
  variableValueBeansId: string | null;
  note: string | null;
  actualTimeMinutes: number | null;
  actualTimeSeconds: number | null;
  overall: number | null;
  flavours: string[];
  aromaQuantity: number | null;
  aromaQuality: number | null;
  aromaNotes: string | null;
  acidityQuantity: number | null;
  acidityQuality: number | null;
  acidityNotes: string | null;
  sweetnessQuantity: number | null;
  sweetnessQuality: number | null;
  sweetnessNotes: string | null;
  bodyQuantity: number | null;
  bodyQuality: number | null;
  bodyNotes: string | null;
  finishQuantity: number | null;
  finishQuality: number | null;
  finishNotes: string | null;
};

type ReviewItem = {
  tastingId: string;
  reason: string;
  details?: unknown;
};

const APPLY = process.argv.includes("--apply");
const LOG_PATH =
  process.argv.find((arg) => arg.startsWith("--log="))?.split("=", 2)[1] ??
  "tastings-normalization-log.json";

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const validVariables: TastingVariable[] = [
  "beans",
  "method",
  "waterType",
  "filterType",
  "grinder",
];

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (isRecord(value)) {
    const seconds =
      typeof value.seconds === "number"
        ? value.seconds
        : typeof value._seconds === "number"
          ? value._seconds
          : null;
    const nanos =
      typeof value.nanoseconds === "number"
        ? value.nanoseconds
        : typeof value._nanoseconds === "number"
          ? value._nanoseconds
          : 0;

    if (seconds !== null) {
      return new Date(seconds * 1000 + Math.round(nanos / 1_000_000));
    }
  }

  return null;
};

const getRefLikeId = (value: unknown): string | null => {
  if (!value) return null;

  if (typeof value === "string") {
    const parts = value.split("/").filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : null;
  }

  if (isRecord(value)) {
    if (typeof value.id === "string") return value.id;

    if (typeof value.path === "string") {
      const parts = value.path.split("/").filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : null;
    }

    if (isRecord(value._path) && Array.isArray(value._path.segments)) {
      const segments = value._path.segments.filter((segment): segment is string => typeof segment === "string");
      return segments.length > 0 ? segments[segments.length - 1] : null;
    }
  }

  return null;
};

const toStringValue = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const toNumericString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";

const toNumberOrNull = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const toIntOrNull = (value: unknown): number | null => {
  const num = toNumberOrNull(value);
  if (num === null) return null;
  return Number.isInteger(num) ? num : Math.round(num);
};

const emptyPrep: TastingPrep = {
  beans: null,
  method: "",
  waterWeight: "",
  beansWeight: "",
  waterTemperature: "",
  grinder: "",
  grindSetting: "",
  waterType: "",
  filterType: "",
  timeMinutes: "",
  timeSeconds: "",
};

const emptyRating: TastingRating = {
  overall: 0,
  flavours: [],
  aromaQuantity: 0,
  aromaQuality: 0,
  aromaNotes: "",
  acidityQuantity: 0,
  acidityQuality: 0,
  acidityNotes: "",
  sweetnessQuantity: 0,
  sweetnessQuality: 0,
  sweetnessNotes: "",
  bodyQuantity: 0,
  bodyQuality: 0,
  bodyNotes: "",
  finishQuantity: 0,
  finishQuality: 0,
  finishNotes: "",
};

const parsePrep = (value: unknown): TastingPrep => {
  if (!isRecord(value)) return emptyPrep;

  return {
    beans: value.beans ?? null,
    method: toStringValue(value.method),
    waterWeight: toNumericString(value.waterWeight),
    beansWeight: toNumericString(value.beansWeight),
    waterTemperature: toNumericString(value.waterTemperature),
    grinder: toStringValue(value.grinder),
    grindSetting: toStringValue(value.grindSetting),
    waterType: toStringValue(value.waterType),
    filterType: toStringValue(value.filterType),
    timeMinutes: toNumericString(value.timeMinutes),
    timeSeconds: toNumericString(value.timeSeconds),
  };
};

const parseRating = (value: unknown): TastingRating => {
  if (!isRecord(value)) return emptyRating;

  const flavours = Array.isArray(value.flavours)
    ? value.flavours.filter((f): f is string => typeof f === "string" && f.trim() !== "")
    : [];

  return {
    overall: toNumberOrNull(value.overall) ?? 0,
    flavours,
    aromaQuantity: toNumberOrNull(value.aromaQuantity) ?? 0,
    aromaQuality: toNumberOrNull(value.aromaQuality) ?? 0,
    aromaNotes: toStringValue(value.aromaNotes),
    acidityQuantity: toNumberOrNull(value.acidityQuantity) ?? 0,
    acidityQuality: toNumberOrNull(value.acidityQuality) ?? 0,
    acidityNotes: toStringValue(value.acidityNotes),
    sweetnessQuantity: toNumberOrNull(value.sweetnessQuantity) ?? 0,
    sweetnessQuality: toNumberOrNull(value.sweetnessQuality) ?? 0,
    sweetnessNotes: toStringValue(value.sweetnessNotes),
    bodyQuantity: toNumberOrNull(value.bodyQuantity) ?? 0,
    bodyQuality: toNumberOrNull(value.bodyQuality) ?? 0,
    bodyNotes: toStringValue(value.bodyNotes),
    finishQuantity: toNumberOrNull(value.finishQuantity) ?? 0,
    finishQuality: toNumberOrNull(value.finishQuality) ?? 0,
    finishNotes: toStringValue(value.finishNotes),
  };
};

const parseTasting = (data: unknown): ParsedTasting => {
  const d = isRecord(data) ? data : {};
  const variableRaw = typeof d.variable === "string" ? d.variable : null;
  const variable = validVariables.includes(variableRaw as TastingVariable)
    ? (variableRaw as TastingVariable)
    : null;

  const samples = Array.isArray(d.samples)
    ? d.samples
        .filter(isRecord)
        .map((sample) => ({
          variableValue: sample.variableValue,
          note: toStringValue(sample.note),
          prep: parsePrep(sample.prep),
          rating: parseRating(sample.rating),
        }))
    : [];

  return {
    rawVariable: variableRaw,
    variable,
    date: toDate(d.date),
    note: toStringValue(d.note),
    samples,
  };
};

const prepFieldLabels: Record<PrepFieldKey, string> = {
  beans: "Beans",
  method: "Method",
  waterWeight: "Water weight",
  beansWeight: "Beans weight",
  waterTemperature: "Water temperature",
  grinder: "Grinder",
  grindSetting: "Grind setting",
  waterType: "Water type",
  filterType: "Filter type",
  timeMinutes: "Time minutes",
  timeSeconds: "Time seconds",
};

const getPrepFieldValue = (prep: TastingPrep, field: PrepFieldKey): string => {
  if (field === "beans") {
    return getRefLikeId(prep.beans) ?? "";
  }
  return prep[field].trim();
};

const appendNote = (existingNote: string, extraNote: string): string => {
  const base = existingNote.trim();
  const extra = extraNote.trim();
  if (!extra) return base;
  if (!base) return extra;
  return `${base}\n\n${extra}`;
};

const mapRefToBeansId = (
  userId: string,
  ref: unknown,
  beansByUserAndFbId: Map<string, string>,
): string | null => {
  const fbId = getRefLikeId(ref);
  if (!fbId) return null;
  return beansByUserAndFbId.get(`${userId}:${fbId}`) ?? null;
};

const normalizeSetup = (
  tasting: TastingRow,
  parsed: ParsedTasting,
  beansByUserAndFbId: Map<string, string>,
): NormalizeSetupResult => {
  const samplePreps = parsed.samples.map((sample) => sample.prep);

  if (samplePreps.length === 0) {
    return {
      setup: {
        beansId: null,
        method: null,
        waterWeight: null,
        beansWeight: null,
        waterTemperature: null,
        grinder: null,
        grindSetting: null,
        waterType: null,
        filterType: null,
        targetTimeMinutes: null,
        targetTimeSeconds: null,
      },
      mixedFields: [],
    };
  }

  const keys: PrepFieldKey[] = [
    "beans",
    "method",
    "waterWeight",
    "beansWeight",
    "waterTemperature",
    "grinder",
    "grindSetting",
    "waterType",
    "filterType",
    "timeMinutes",
    "timeSeconds",
  ];

  const sharedValues: Record<PrepFieldKey, string | null> = {
    beans: null,
    method: null,
    waterWeight: null,
    beansWeight: null,
    waterTemperature: null,
    grinder: null,
    grindSetting: null,
    waterType: null,
    filterType: null,
    timeMinutes: null,
    timeSeconds: null,
  };
  const mixedFields: PrepFieldKey[] = [];

  for (const key of keys) {
    const values = samplePreps.map((prep) => getPrepFieldValue(prep, key));
    const first = values[0];
    const allSame = values.every((value) => value === first);
    if (allSame) {
      sharedValues[key] = first;
    } else {
      mixedFields.push(key);
    }
  }

  return {
    setup: {
      beansId:
        parsed.variable === "beans"
          ? null
          : mapRefToBeansId(tasting.userId, sharedValues.beans, beansByUserAndFbId),
      method: sharedValues.method || null,
      waterWeight: toNumberOrNull(sharedValues.waterWeight),
      beansWeight: toNumberOrNull(sharedValues.beansWeight),
      waterTemperature: toNumberOrNull(sharedValues.waterTemperature),
      grinder: sharedValues.grinder || null,
      grindSetting: sharedValues.grindSetting || null,
      waterType: sharedValues.waterType || null,
      filterType: sharedValues.filterType || null,
      targetTimeMinutes: toIntOrNull(sharedValues.timeMinutes),
      targetTimeSeconds: toIntOrNull(sharedValues.timeSeconds),
    },
    mixedFields,
  };
};

const normalizeSample = (
  tasting: TastingRow,
  parsed: ParsedTasting,
  sample: TastingSample,
  position: number,
  beansByUserAndFbId: Map<string, string>,
  mixedFields: PrepFieldKey[],
): SampleInsert | null => {
  if (!parsed.variable) return null;

  const variableValueBeansId =
    parsed.variable === "beans"
      ? mapRefToBeansId(tasting.userId, sample.variableValue, beansByUserAndFbId)
      : null;

  const variableValueText =
    parsed.variable === "beans"
      ? null
      : typeof sample.variableValue === "string"
        ? sample.variableValue.trim() || null
        : null;

  if (parsed.variable === "beans" && !variableValueBeansId) {
    return null;
  }

  if (parsed.variable !== "beans" && !variableValueText) {
    return null;
  }

  const r = sample.rating;
  const differenceLines = mixedFields.map((field) => {
    const value = getPrepFieldValue(sample.prep, field);
    const renderedValue = value === "" ? "_empty_" : `\`${value}\``;
    return `- **${prepFieldLabels[field]}**: ${renderedValue}`;
  });
  const differencesNote =
    differenceLines.length === 0
      ? ""
      : `### Prep differences for this sample\n${differenceLines.join("\n")}`;
  const note = appendNote(sample.note, differencesNote);

  return {
    tastingId: tasting.id,
    position,
    variableValueText,
    variableValueBeansId,
    note: note || null,
    actualTimeMinutes: toIntOrNull(sample.prep.timeMinutes),
    actualTimeSeconds: toIntOrNull(sample.prep.timeSeconds),
    overall: r.overall > 0 ? r.overall : null,
    flavours: r.flavours,
    aromaQuantity: r.aromaQuantity > 0 ? r.aromaQuantity : null,
    aromaQuality: r.aromaQuality > 0 ? r.aromaQuality : null,
    aromaNotes: r.aromaNotes || null,
    acidityQuantity: r.acidityQuantity > 0 ? r.acidityQuantity : null,
    acidityQuality: r.acidityQuality > 0 ? r.acidityQuality : null,
    acidityNotes: r.acidityNotes || null,
    sweetnessQuantity: r.sweetnessQuantity > 0 ? r.sweetnessQuantity : null,
    sweetnessQuality: r.sweetnessQuality > 0 ? r.sweetnessQuality : null,
    sweetnessNotes: r.sweetnessNotes || null,
    bodyQuantity: r.bodyQuantity > 0 ? r.bodyQuantity : null,
    bodyQuality: r.bodyQuality > 0 ? r.bodyQuality : null,
    bodyNotes: r.bodyNotes || null,
    finishQuantity: r.finishQuantity > 0 ? r.finishQuantity : null,
    finishQuality: r.finishQuality > 0 ? r.finishQuality : null,
    finishNotes: r.finishNotes || null,
  };
};

const main = async () => {
  const sql = postgres(requireEnv("DATABASE_URL"), { max: 1 });

  const tastings = await sql<TastingRow[]>`
    select id, user_id as "userId", created_at as "createdAt", data
    from tastings
    where data is not null
    order by created_at asc
  `;

  const beansRows = await sql<BeansMapRow[]>`
    select id, user_id as "userId", fb_id as "fbId"
    from beans
    where fb_id is not null
  `;

  const beansByUserAndFbId = new Map<string, string>();
  for (const row of beansRows) {
    beansByUserAndFbId.set(`${row.userId}:${row.fbId}`, row.id);
  }

  const review: ReviewItem[] = [];
  const updates: Array<{ tastingId: string; parsed: ParsedTasting; setup: NormalizedSetup; sampleInserts: SampleInsert[] }> =
    [];

  let mixedPrepCount = 0;
  let skippedInvalidVariable = 0;
  let skippedInvalidSamples = 0;

  for (const tasting of tastings) {
    const parsed = parseTasting(tasting.data);

    if (!parsed.variable) {
      skippedInvalidVariable += 1;
      review.push({
        tastingId: tasting.id,
        reason: "Invalid or missing tasting.variable",
        details: { rawVariable: parsed.rawVariable },
      });
      continue;
    }

    const { setup, mixedFields } = normalizeSetup(tasting, parsed, beansByUserAndFbId);
    if (mixedFields.length > 0) {
      mixedPrepCount += 1;
      review.push({
        tastingId: tasting.id,
        reason: "Mixed prep values across samples; using only shared values on tasting and adding differences to sample notes",
        details: { mixedFields },
      });
    }

    const sampleInserts = parsed.samples
      .map((sample, i) =>
        normalizeSample(tasting, parsed, sample, i + 1, beansByUserAndFbId, mixedFields),
      )
      .filter((sample): sample is SampleInsert => sample !== null);

    if (sampleInserts.length !== parsed.samples.length) {
      skippedInvalidSamples += parsed.samples.length - sampleInserts.length;
      review.push({
        tastingId: tasting.id,
        reason: "One or more samples could not be normalized",
        details: {
          originalSamples: parsed.samples.length,
          normalizedSamples: sampleInserts.length,
        },
      });
    }

    updates.push({ tastingId: tasting.id, parsed, setup, sampleInserts });
  }

  if (APPLY) {
    await sql.begin(async (tx) => {
      for (const item of updates) {
        const normalizedDate = item.parsed.date ?? null;

        await tx`
          update tastings
          set
            date = ${normalizedDate},
            variable = ${item.parsed.variable},
            note = ${item.parsed.note || null},
            beans_id = ${item.setup.beansId},
            method = ${item.setup.method},
            water_weight = ${item.setup.waterWeight},
            beans_weight = ${item.setup.beansWeight},
            water_temperature = ${item.setup.waterTemperature},
            grinder = ${item.setup.grinder},
            grind_setting = ${item.setup.grindSetting},
            water_type = ${item.setup.waterType},
            filter_type = ${item.setup.filterType},
            target_time_minutes = ${item.setup.targetTimeMinutes},
            target_time_seconds = ${item.setup.targetTimeSeconds}
          where id = ${item.tastingId}
        `;

        await tx`delete from tasting_samples where tasting_id = ${item.tastingId}`;

        for (const sample of item.sampleInserts) {
          await tx`
            insert into tasting_samples (
              tasting_id,
              position,
              variable_value_text,
              variable_value_beans_id,
              note,
              actual_time_minutes,
              actual_time_seconds,
              overall,
              flavours,
              aroma_quantity,
              aroma_quality,
              aroma_notes,
              acidity_quantity,
              acidity_quality,
              acidity_notes,
              sweetness_quantity,
              sweetness_quality,
              sweetness_notes,
              body_quantity,
              body_quality,
              body_notes,
              finish_quantity,
              finish_quality,
              finish_notes
            )
            values (
              ${sample.tastingId},
              ${sample.position},
              ${sample.variableValueText},
              ${sample.variableValueBeansId},
              ${sample.note},
              ${sample.actualTimeMinutes},
              ${sample.actualTimeSeconds},
              ${sample.overall},
              ${tx.array(sample.flavours)},
              ${sample.aromaQuantity},
              ${sample.aromaQuality},
              ${sample.aromaNotes},
              ${sample.acidityQuantity},
              ${sample.acidityQuality},
              ${sample.acidityNotes},
              ${sample.sweetnessQuantity},
              ${sample.sweetnessQuality},
              ${sample.sweetnessNotes},
              ${sample.bodyQuantity},
              ${sample.bodyQuality},
              ${sample.bodyNotes},
              ${sample.finishQuantity},
              ${sample.finishQuality},
              ${sample.finishNotes}
            )
          `;
        }
      }
    });
  }

  const normalizedSampleCount = updates.reduce((acc, item) => acc + item.sampleInserts.length, 0);

  const log = {
    generatedAt: new Date().toISOString(),
    apply: APPLY,
    counts: {
      tastingsRead: tastings.length,
      tastingsPrepared: updates.length,
      samplesPrepared: normalizedSampleCount,
      mixedPrepCount,
      skippedInvalidVariable,
      skippedInvalidSamples,
      reviewCount: review.length,
    },
    review,
  };

  await fs.writeFile(LOG_PATH, JSON.stringify(log, null, 2), "utf-8");

  console.log(`Apply mode: ${APPLY}`);
  console.log(`Tastings read: ${tastings.length}`);
  console.log(`Tastings prepared: ${updates.length}`);
  console.log(`Samples prepared: ${normalizedSampleCount}`);
  console.log(`Mixed prep: ${mixedPrepCount}`);
  console.log(`Skipped invalid variable: ${skippedInvalidVariable}`);
  console.log(`Skipped invalid samples: ${skippedInvalidSamples}`);
  console.log(`Review rows: ${review.length}`);
  console.log(`Log: ${LOG_PATH}`);

  await sql.end({ timeout: 5 });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
