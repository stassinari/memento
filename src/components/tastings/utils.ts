import dayjs from "dayjs";

import type { Beans } from "~/db/types";

export const tastingVariablesList = [
  { value: "method", label: "Method", plural: "methods" },
  { value: "waterType", label: "Water type", plural: "water types" },
  { value: "filterType", label: "Filter type", plural: "filter types" },
  { value: "grinder", label: "Grinder", plural: "grinders" },
] as const;

export const getTastingVariableLabel = (value: string): string => {
  if (value === "beans") return "Beans";
  const mapped = tastingVariablesList.find((item) => item.value === value);
  return mapped?.label ?? value;
};

type BeansLookupValue = Pick<Beans, "id" | "name" | "roaster">;

export const buildBeansLookup = (beansList: BeansLookupValue[]) => {
  const byId = new Map<string, BeansLookupValue>();

  beansList.forEach((bean) => {
    byId.set(bean.id, bean);
  });

  return { byId };
};

export const getNormalizedTastingSampleLabel = (
  variable: string | null,
  sample: { variableValueText: string | null; variableValueBeansId: string | null },
  lookup: ReturnType<typeof buildBeansLookup>,
): string => {
  if (variable === "beans") {
    if (!sample.variableValueBeansId) return "Unknown bean";
    const bean = lookup.byId.get(sample.variableValueBeansId);
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
