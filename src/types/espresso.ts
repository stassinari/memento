import { DocumentReference, Timestamp } from "firebase/firestore";
import { TastingScores } from "./brew";

export type Espresso = EspressoPrep & EspressoOutcome;

export interface EspressoPrep {
  id?: string;

  date: Timestamp;
  beans: DocumentReference;

  machine: string | null;
  grinder: string | null;
  grinderBurrs: string | null;
  portafilter: string | null;
  basket: string | null;

  targetWeight: number;
  beansWeight: number; // FIXME wtf is this type? :O
  waterTemperature: number | null;
  grindSetting: string | null;

  actualWeight: number | null;
  actualTime: number;

  // FIXME split out and make proper DecentEspresso type
  fromDecent?: boolean;
  partial?: boolean;
  profileName?: string;
}

export interface EspressoOutcome {
  rating: number;
  notes: string;
  tastingScores: TastingScores;
  tds?: number;
}

export interface DecentReadings {
  time: number[];
  pressure: number[];
  weightTotal: number[];
  flow: number[];
  weightFlow: number[];
  temperatureBasket: number[];
  temperatureMix: number[];
  pressureGoal: number[];
  temperatureGoal: number[];
  flowGoal: number[];
}
