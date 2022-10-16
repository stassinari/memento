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
  beansWeight: number; // FIXME wtf is this type? :O
  waterTemperature: number | null;
  grindSetting: string | null;

  timeMinutes: number | null;
  timeSeconds: string | null;
}

export interface BrewOutcome {
  // rating: number;
  // notes: string;
  // tastingScores: TastingScores;
  // tds?: number;
  // finalBrewWeight?: number;
  // extractionType?: string; // "percolation" | "immersion"
}