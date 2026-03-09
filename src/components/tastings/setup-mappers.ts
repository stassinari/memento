import { TastingSetupFormInputs } from "~/components/tastings/form-types";
import { TastingVariable } from "~/db/schema";

interface TastingSetupSampleSource {
  id: string;
  position: number;
  variableValueText: string | null;
  variableValueBeansId: string | null;
  note: string | null;
}

interface TastingSetupSource {
  date: Date | null;
  createdAt: Date;
  variable: TastingVariable | null;
  name: string | null;
  note: string | null;
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
  samples: TastingSetupSampleSource[];
}

export const mapTastingSetupFormValuesFromTasting = (
  tasting: TastingSetupSource,
): TastingSetupFormInputs => ({
  date: tasting.date ?? tasting.createdAt,
  variable: tasting.variable,
  name: tasting.name ?? "",
  note: tasting.note ?? "",
  beansId: tasting.beansId,
  method: tasting.method ?? "",
  waterWeight: tasting.waterWeight,
  beansWeight: tasting.beansWeight,
  waterTemperature: tasting.waterTemperature,
  grinder: tasting.grinder ?? "",
  grindSetting: tasting.grindSetting ?? "",
  waterType: tasting.waterType ?? "",
  filterType: tasting.filterType ?? "",
  targetTimeMinutes: tasting.targetTimeMinutes,
  targetTimeSeconds: tasting.targetTimeSeconds,
  samples: tasting.samples.map((sample, index) => ({
    id: sample.id,
    position: sample.position ?? index,
    variableValueText: sample.variableValueText ?? "",
    variableValueBeansId: sample.variableValueBeansId,
    note: sample.note ?? "",
  })),
});
