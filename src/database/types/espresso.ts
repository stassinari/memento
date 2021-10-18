import { Beans } from "./beans";
import { TastingScores } from "./common";

export type Espresso = EspressoPrep & EspressoOutcome;

export interface EspressoPrep {
  id?: string;
  date: firebase.default.firestore.Timestamp | Date;
  beans: firebase.default.firestore.DocumentReference | Beans | null;
  beansWeight: string;
  targetWeight: string;
  waterTemperature: string;
  grindSetting: string;
  grinder: string;
  grinderBurrs: string;
  machine: string;
  portafilter: string;
  basket: string;
  actualWeight: string;
  actualTime: string;
  fromDecent?: boolean;
  partial?: boolean;
  profileName?: string;
}

export interface EspressoOutcome {
  rating: number;
  notes: string;
  tastingScores: TastingScores;
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
