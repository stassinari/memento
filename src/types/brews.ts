import { DocumentReference, Timestamp } from "firebase/firestore";

export type Brew = BrewPrep & BrewOutcome;

export interface BrewPrep {
  id?: string;

  method: string;
  date: Timestamp;
  beans: DocumentReference;

  grinder: string | null;
  grinderBurrs: string | null;
  waterType: string | null;
  filterType: string | null;

  waterWeight: number;
  beansWeight: number;
  waterTemperature: number | null;
  grindSetting: string | null;

  timeMinutes: number | null;
  timeSeconds: number | null;
}

export interface BrewOutcome {
  rating: number | null;
  notes: string | null;
  tastingScores: TastingScores;
  tds?: number;
  finalBrewWeight?: number;
  extractionType?: string; // "percolation" | "immersion"
}

export interface TastingScores {
  aroma: number | null;
  acidity: number | null;
  sweetness: number | null;
  body: number | null;
  finish: number | null;
}
