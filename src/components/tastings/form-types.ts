import { TastingVariable } from "~/db/schema";

export interface TastingSetupSampleInputs {
  id?: string;
  position: number;
  variableValueText: string | null;
  variableValueBeansId: string | null;
  note: string | null;
}

export interface TastingSetupFormInputs {
  date: Date | null;
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

  samples: TastingSetupSampleInputs[];
}

export interface TastingSampleRatingInputs {
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
}

export interface TastingScoringSampleInputs extends TastingSampleRatingInputs {
  id: string;
  note: string | null;
  actualTimeMinutes: number | null;
  actualTimeSeconds: number | null;
}

export interface TastingScoringFormInputs {
  samples: TastingScoringSampleInputs[];
}
