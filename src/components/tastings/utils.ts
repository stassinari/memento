import dayjs from "dayjs";

import type { Beans } from "~/db/types";

export const tastingVariablesList = [
  { value: "method", label: "Method", plural: "methods" },
  { value: "waterType", label: "Water type", plural: "water types" },
  { value: "filterType", label: "Filter type", plural: "filter types" },
  { value: "grinder", label: "Grinder", plural: "grinders" },
] as const;

export type TastingVariable = "beans" | (typeof tastingVariablesList)[number]["value"];

export interface FirestoreTimestampLike {
  seconds?: number;
  nanoseconds?: number;
  _seconds?: number;
  _nanoseconds?: number;
}

export interface FirestoreDocRefLike {
  id?: string;
  path?: string;
  _path?: {
    segments?: string[];
  };
}

export interface TastingPrepData {
  method: string;
  beans: FirestoreDocRefLike | null;
  waterWeight: string;
  beansWeight: string;
  waterTemperature: string;
  grinder: string;
  grindSetting: string;
  waterType: string;
  filterType: string;
  timeMinutes: string;
  timeSeconds: string;
}

export interface TastingRatingData {
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
}

export interface TastingSampleData {
  variableValue: string | FirestoreDocRefLike;
  prep: TastingPrepData;
  rating: TastingRatingData;
}

export interface TastingData {
  variable: TastingVariable | string;
  samples: TastingSampleData[];
  prepDone: boolean;
  date: Date | null;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseUnknownDate = (value: unknown): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

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

export const emptyTastingPrep: TastingPrepData = {
  method: "",
  beans: null,
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

export const emptyTastingRating: TastingRatingData = {
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

const toStringValue = (value: unknown): string => (typeof value === "string" ? value : "");
const toNumberValue = (value: unknown): number => (typeof value === "number" ? value : 0);

const toFirestoreRefLike = (value: unknown): FirestoreDocRefLike | null => {
  if (!isRecord(value)) {
    return null;
  }

  const segments =
    isRecord(value._path) && Array.isArray(value._path.segments)
      ? value._path.segments.filter((segment): segment is string => typeof segment === "string")
      : undefined;

  return {
    id: typeof value.id === "string" ? value.id : undefined,
    path: typeof value.path === "string" ? value.path : undefined,
    _path: segments ? { segments } : undefined,
  };
};

const parseTastingPrep = (value: unknown): TastingPrepData => {
  if (!isRecord(value)) {
    return emptyTastingPrep;
  }

  return {
    method: toStringValue(value.method),
    beans: toFirestoreRefLike(value.beans),
    waterWeight: toStringValue(value.waterWeight),
    beansWeight: toStringValue(value.beansWeight),
    waterTemperature: toStringValue(value.waterTemperature),
    grinder: toStringValue(value.grinder),
    grindSetting: toStringValue(value.grindSetting),
    waterType: toStringValue(value.waterType),
    filterType: toStringValue(value.filterType),
    timeMinutes: toStringValue(value.timeMinutes),
    timeSeconds: toStringValue(value.timeSeconds),
  };
};

const parseTastingRating = (value: unknown): TastingRatingData => {
  if (!isRecord(value)) {
    return emptyTastingRating;
  }

  return {
    overall: toNumberValue(value.overall),
    flavours: Array.isArray(value.flavours)
      ? value.flavours.filter((item): item is string => typeof item === "string")
      : [],
    aromaQuantity: toNumberValue(value.aromaQuantity),
    aromaQuality: toNumberValue(value.aromaQuality),
    aromaNotes: toStringValue(value.aromaNotes),
    acidityQuantity: toNumberValue(value.acidityQuantity),
    acidityQuality: toNumberValue(value.acidityQuality),
    acidityNotes: toStringValue(value.acidityNotes),
    sweetnessQuantity: toNumberValue(value.sweetnessQuantity),
    sweetnessQuality: toNumberValue(value.sweetnessQuality),
    sweetnessNotes: toStringValue(value.sweetnessNotes),
    bodyQuantity: toNumberValue(value.bodyQuantity),
    bodyQuality: toNumberValue(value.bodyQuality),
    bodyNotes: toStringValue(value.bodyNotes),
    finishQuantity: toNumberValue(value.finishQuantity),
    finishQuality: toNumberValue(value.finishQuality),
    finishNotes: toStringValue(value.finishNotes),
  };
};

const toLabel = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (!value) return "";
  if (isRecord(value)) {
    if (typeof value.name === "string") return value.name;
    if (typeof value.label === "string") return value.label;
    if (typeof value.path === "string") {
      const parts = value.path.split("/").filter(Boolean);
      return parts[parts.length - 1] ?? "";
    }
  }

  return "";
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

export const getTastingVariableLabel = (value: string): string => {
  if (value === "beans") return "Beans";
  const mapped = tastingVariablesList.find((item) => item.value === value);
  return mapped?.label ?? value;
};

export const parseTastingData = (rawData: unknown): TastingData => {
  const data = isRecord(rawData) ? rawData : {};

  const variable = typeof data.variable === "string" ? data.variable : "unknown";
  const samples = Array.isArray(data.samples)
    ? data.samples.filter(isRecord).map((sample) => ({
        variableValue:
          typeof sample.variableValue === "string" || isRecord(sample.variableValue)
            ? (sample.variableValue as string | FirestoreDocRefLike)
            : "",
        prep: parseTastingPrep(sample.prep),
        rating: parseTastingRating(sample.rating),
      }))
    : [];

  const date = parseUnknownDate(data.date);

  return {
    variable,
    samples,
    prepDone: Boolean(data.prepDone),
    date,
  };
};

export const hasMeaningfulPrep = (prep: TastingPrepData): boolean =>
  prep.method !== "" ||
  prep.beans !== null ||
  prep.waterWeight !== "" ||
  prep.beansWeight !== "" ||
  prep.waterTemperature !== "" ||
  prep.grinder !== "" ||
  prep.grindSetting !== "" ||
  prep.waterType !== "" ||
  prep.filterType !== "" ||
  prep.timeMinutes !== "" ||
  prep.timeSeconds !== "";

export const hasMeaningfulRating = (rating: TastingRatingData): boolean =>
  rating.overall > 0 ||
  rating.flavours.length > 0 ||
  rating.aromaQuantity > 0 ||
  rating.aromaQuality > 0 ||
  rating.aromaNotes !== "" ||
  rating.acidityQuantity > 0 ||
  rating.acidityQuality > 0 ||
  rating.acidityNotes !== "" ||
  rating.sweetnessQuantity > 0 ||
  rating.sweetnessQuality > 0 ||
  rating.sweetnessNotes !== "" ||
  rating.bodyQuantity > 0 ||
  rating.bodyQuality > 0 ||
  rating.bodyNotes !== "" ||
  rating.finishQuantity > 0 ||
  rating.finishQuality > 0 ||
  rating.finishNotes !== "";

type BeansLookupValue = Pick<Beans, "id" | "fbId" | "name" | "roaster">;

export const buildBeansLookup = (beansList: BeansLookupValue[]) => {
  const byId = new Map<string, BeansLookupValue>();
  const byFbId = new Map<string, BeansLookupValue>();

  beansList.forEach((bean) => {
    byId.set(bean.id, bean);
    if (bean.fbId) {
      byFbId.set(bean.fbId, bean);
    }
  });

  return {
    byId,
    byFbId,
  };
};

export const getTastingSampleLabel = (
  variable: string,
  sample: TastingSampleData,
  lookup: ReturnType<typeof buildBeansLookup>,
): string => {
  const rawValue = sample.variableValue;

  if (variable !== "beans") {
    return toLabel(rawValue);
  }

  const refLikeId = getRefLikeId(rawValue);

  if (refLikeId) {
    const bean = lookup.byId.get(refLikeId) ?? lookup.byFbId.get(refLikeId);
    if (bean) {
      return `${bean.name} (${bean.roaster})`;
    }
    return `Unknown bean (${refLikeId})`;
  }

  return "Unknown bean";
};

export const getNormalizedTastingSampleLabel = (
  variable: string | null,
  sample: { variableValueText: string | null; variableValueBeansId: string | null },
  lookup: ReturnType<typeof buildBeansLookup>,
): string => {
  if (variable === "beans") {
    if (!sample.variableValueBeansId) return "Unknown bean";
    const bean = lookup.byId.get(sample.variableValueBeansId) ?? lookup.byFbId.get(sample.variableValueBeansId);
    if (!bean) {
      return `Unknown bean (${sample.variableValueBeansId})`;
    }
    return `${bean.name} (${bean.roaster})`;
  }

  return sample.variableValueText ?? "";
};

export const hasMeaningfulNormalizedRating = (sample: {
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
}): boolean =>
  (sample.overall ?? 0) > 0 ||
  sample.flavours.length > 0 ||
  (sample.aromaQuantity ?? 0) > 0 ||
  (sample.aromaQuality ?? 0) > 0 ||
  (sample.aromaNotes ?? "") !== "" ||
  (sample.acidityQuantity ?? 0) > 0 ||
  (sample.acidityQuality ?? 0) > 0 ||
  (sample.acidityNotes ?? "") !== "" ||
  (sample.sweetnessQuantity ?? 0) > 0 ||
  (sample.sweetnessQuality ?? 0) > 0 ||
  (sample.sweetnessNotes ?? "") !== "" ||
  (sample.bodyQuantity ?? 0) > 0 ||
  (sample.bodyQuality ?? 0) > 0 ||
  (sample.bodyNotes ?? "") !== "" ||
  (sample.finishQuantity ?? 0) > 0 ||
  (sample.finishQuality ?? 0) > 0 ||
  (sample.finishNotes ?? "") !== "";

export const formatTastingDate = (date: Date | null): string => {
  if (!date) return "Unknown date";
  return dayjs(date).format("DD MMM YYYY @ HH:mm");
};
