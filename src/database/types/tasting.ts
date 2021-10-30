export type TastingVariable =
  | "beans"
  | "method"
  | "waterType"
  | "waterTemperature"
  | "filterType"
  | "grindSetting"
  | "grinder";

export interface Tasting {
  id?: string;
  variable: TastingVariable;
  samples: TastingSample[];
  prepDone?: boolean;
  date: firebase.default.firestore.Timestamp | Date | null;
}

export interface TastingSample {
  variableValue: string | firebase.default.firestore.DocumentReference;
  prep?: TastingPrep;
  rating?: TastingRating;
}

export interface TastingPrep {
  id?: string;
  method: string;
  beans: firebase.default.firestore.DocumentReference | null;
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

export interface TastingRating {
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
