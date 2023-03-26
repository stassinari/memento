import { DocumentReference, Timestamp } from "firebase/firestore";
import { TastingScores } from "./brew";

export type Espresso = BaseEspresso | DecentEspresso;

export type BaseEspresso = BaseEspressoPrep & EspressoOutcome;

interface SharedEspressoFields {
  id?: string;

  date: Timestamp;

  grindSetting: string | null;

  machine: string | null;
  grinder: string | null;
  grinderBurrs: string | null;
  portafilter: string | null;
  basket: string | null;

  actualTime: number;
}

export interface BaseEspressoPrep extends SharedEspressoFields {
  beans: DocumentReference;

  targetWeight: number;
  beansWeight: number;
  waterTemperature: number | null;

  actualWeight: number | null;

  fromDecent?: false;
}

export interface EspressoOutcome {
  rating: number | null;
  notes: string | null;
  tastingScores: TastingScores | null;
  tds: number | null;
}

export type DecentEspresso = DecentEspressoPrep & EspressoOutcome;

export interface DecentEspressoPrep extends SharedEspressoFields {
  beans?: DocumentReference | null;

  targetWeight?: number | null;
  beansWeight?: number | null;

  actualWeight: number;

  fromDecent: true;
  partial?: boolean;
  profileName: string;
  uploadedAt: Date;
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
