import { TastingVariable } from "~/db/schema";
import { Beans } from "~/db/types";
import { SelectOptionGroup } from "../Select";
import { TastingSetupFormInputs, TastingSetupSampleInputs } from "./form-types";

export const toNullableString = (value: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const toNullableNumber = (value: number | null): number | null =>
  value === null || Number.isNaN(value) ? null : value;

export const getEmptySample = (position: number): TastingSetupSampleInputs => ({
  position,
  variableValueText: "",
  variableValueBeansId: null,
  note: "",
});

export const tastingFormEmptyValues: TastingSetupFormInputs = {
  date: new Date(),
  variable: TastingVariable.Beans,
  name: "",
  note: "",
  beansId: null,
  method: "",
  waterWeight: null,
  beansWeight: null,
  waterTemperature: null,
  grinder: "",
  grindSetting: "",
  waterType: "",
  filterType: "",
  targetTimeMinutes: null,
  targetTimeSeconds: null,
  samples: [getEmptySample(0), getEmptySample(1)],
};

export const groupBeansOptions = (
  beansList: Pick<Beans, "id" | "name" | "roaster" | "isFrozen" | "roastDate">[],
) => {
  const sorted = [...beansList].sort((a, b) => {
    const aTime = a.roastDate ? new Date(a.roastDate).getTime() : 0;
    const bTime = b.roastDate ? new Date(b.roastDate).getTime() : 0;
    return bTime - aTime;
  });

  return {
    open: sorted.filter((bean) => !bean.isFrozen),
    frozen: sorted.filter((bean) => bean.isFrozen),
  };
};

export const buildBeansById = (
  beansList: Pick<Beans, "id" | "name" | "roaster">[],
): Map<string, string> => {
  const map = new Map<string, string>();
  beansList.forEach((bean) => {
    map.set(bean.id, `${bean.name} (${bean.roaster})`);
  });
  return map;
};

export const getTargetTimeSummary = (
  targetTimeMinutes: number | null,
  targetTimeSeconds: number | null,
): string | null =>
  targetTimeMinutes !== null || targetTimeSeconds !== null
    ? `${targetTimeMinutes ?? 0}:${String(targetTimeSeconds ?? 0).padStart(2, "0")}`
    : null;

export const getBeansSelectGroups = ({
  groupedBeansOptions,
  selectedBeanIds = [],
  currentBeansId = null,
}: {
  groupedBeansOptions: ReturnType<typeof groupBeansOptions>;
  selectedBeanIds?: string[];
  currentBeansId?: string | null;
}): SelectOptionGroup[] => [
  {
    label: "Open",
    options: groupedBeansOptions.open.map((bean) => ({
      value: bean.id,
      label: bean.name,
      secondaryText: bean.roaster,
      disabled: selectedBeanIds.includes(bean.id) && currentBeansId !== bean.id,
    })),
  },
  {
    label: "Frozen",
    options: groupedBeansOptions.frozen.map((bean) => ({
      value: bean.id,
      label: bean.name,
      secondaryText: bean.roaster,
      disabled: selectedBeanIds.includes(bean.id) && currentBeansId !== bean.id,
    })),
  },
];

export const validateStep2Samples = ({
  variable,
  samples,
}: {
  variable: TastingVariable | null;
  samples: TastingSetupSampleInputs[];
}): string | null => {
  if (!variable) {
    return "Please select what variable you are tasting.";
  }

  if (samples.length < 2) {
    return "Please keep at least two samples.";
  }

  if (variable === TastingVariable.Beans) {
    const selectedBeanIds = samples
      .map((sample) => sample.variableValueBeansId)
      .filter((value): value is string => Boolean(value));
    const hasMissingBeans = samples.some((sample) => !sample.variableValueBeansId);
    if (hasMissingBeans) {
      return "Every sample needs beans selected.";
    }

    const uniqueCount = new Set(selectedBeanIds).size;
    if (uniqueCount !== selectedBeanIds.length) {
      return "The same beans cannot be selected twice.";
    }

    return null;
  }

  const hasMissingValue = samples.some((sample) => !sample.variableValueText?.trim());
  if (hasMissingValue) {
    return "Every sample needs a variable value.";
  }

  return null;
};

export const normalizeTastingSetupFormData = (
  data: TastingSetupFormInputs,
): TastingSetupFormInputs => {
  if (!data.variable) {
    throw new Error("Variable is required");
  }

  const variable = data.variable;
  const normalizedSamples = data.samples.map((sample, index) => ({
    ...sample,
    position: index,
    variableValueBeansId:
      variable === TastingVariable.Beans ? sample.variableValueBeansId : null,
    variableValueText:
      variable === TastingVariable.Beans ? null : toNullableString(sample.variableValueText),
    note: toNullableString(sample.note),
  }));

  return {
    ...data,
    variable,
    name: toNullableString(data.name),
    note: toNullableString(data.note),
    method: toNullableString(data.method),
    grinder: toNullableString(data.grinder),
    grindSetting: toNullableString(data.grindSetting),
    waterType: toNullableString(data.waterType),
    filterType: toNullableString(data.filterType),
    waterWeight: toNullableNumber(data.waterWeight),
    beansWeight: toNullableNumber(data.beansWeight),
    waterTemperature: toNullableNumber(data.waterTemperature),
    targetTimeMinutes: toNullableNumber(data.targetTimeMinutes),
    targetTimeSeconds: toNullableNumber(data.targetTimeSeconds),
    beansId: variable === TastingVariable.Beans ? null : data.beansId,
    samples: normalizedSamples,
  };
};
