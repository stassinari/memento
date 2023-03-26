import { DocumentReference, Timestamp } from "firebase/firestore";
import { TastingScores } from "./brew";

export type Espresso = BaseEspresso | DecentEspresso;

export type BaseEspresso = BaseEspressoPrep & EspressoOutcome;

export interface BaseEspressoPrep {
  id?: string;

  date: Timestamp;
  beans: DocumentReference;

  machine: string | null;
  grinder: string | null;
  grinderBurrs: string | null;
  portafilter: string | null;
  basket: string | null;

  targetWeight: number;
  beansWeight: number;
  waterTemperature: number | null;
  grindSetting: string | null;

  actualWeight: number | null;
  actualTime: number;

  fromDecent?: false;
}

export type DecentEspresso = DecentEspressoPrep & EspressoOutcome;

// interface DecentEspressoPartialPrep {
//   partial?: true;
//   profileName: string;
//   fromDecent: true;
// }

export interface DecentEspressoPrep
  extends Omit<
    BaseEspressoPrep,
    "beansWeight" | "fromDecent" | "waterTemperature" | "beans" | "targetWeight"
  > {
  beans?: DocumentReference | null;
  beansWeight?: number | null;
  targetWeight?: number | null;

  fromDecent: true;
  partial?: boolean;
  profileName: string;
}

export interface EspressoOutcome {
  rating: number | null;
  notes: string | null;
  tastingScores: TastingScores | null;
  tds: number | null;
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
