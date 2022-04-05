import { Beans } from "./beans";
import { TastingScores } from "./common";

export type Brew = BrewPrep & BrewOutcome;

export interface BrewPrep {
  id?: string;
  method: string;
  date: firebase.default.firestore.Timestamp | Date;
  beans: firebase.default.firestore.DocumentReference | Beans | null;
  waterWeight: string;
  beansWeight: string; // FIXME wtf is this type? :O
  waterTemperature: string;
  grinder: string;
  grinderBurrs: string;
  grindSetting: string;
  waterType: string;
  filterType: string;
  timeMinutes: string;
  timeSeconds: string;
}

export interface BrewOutcome {
  rating: number;
  notes: string;
  tastingScores: TastingScores;
  tds?: number;
  finalBrewWeight?: number;
  extractionType?: string; // "percolation" | "immersion"
}
