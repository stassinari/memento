interface User {
  secretKey?: string;
}

type RoastStyle = "filter" | "espresso" | "omni-roast";
type Origin = "single-origin" | "blend";

type Beans = BeansCommon & BeansSingleOrigin & BeansBlend;

interface BeansCommon {
  id?: string;
  name: string;
  isFinished: boolean;
  roaster: string;
  roastDate: firebase.firestore.Timestamp | Date | null;
  roastStyle: RoastStyle | null;
  roastLevel?: number | null;
  roastingNotes: never[];
  origin: Origin;
  freezeDate: firebase.firestore.Timestamp | Date | null;
  thawDate: firebase.firestore.Timestamp | Date | null;
}

interface BeansSingleOrigin {
  country: string | null;
  region: string;
  varietals: never[];
  altitude: string;
  process: string;
  farmer: string;
  harvestDate: null;
}

interface BeansBlend {
  blend?: BeansBlendPart[];
}

interface BeansBlendPart {
  name?: string;
  country?: string;
  varietals?: string[];
  percentage?: number;
  process?: string;
}

interface BrewPrep {
  id?: string;
  method: string;
  date: firebase.firestore.Timestamp | Date;
  beans: firebase.firestore.DocumentReference | null;
  waterWeight: string;
  beansWeight: string;
  waterTemperature: string;
  grinder: string;
  grinderBurrs: string;
  grindSetting: string;
  waterType: string;
  filterType: string;
  timeMinutes: string;
  timeSeconds: string;
}

interface BrewOutcome {
  rating: number;
  notes: string;
  tastingScores: TastingScores;
}

interface EspressoPrep {
  id?: string;
  date: firebase.firestore.Timestamp | Date;
  beans: firebase.firestore.DocumentReference | null;
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

interface EspressoOutcome {
  rating: number;
  notes: string;
  tastingScores: TastingScores;
}

interface DecentReadings {
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

type TastingVariable =
  | "beans"
  | "method"
  | "waterType"
  | "waterTemperature"
  | "filterType"
  | "grindSetting"
  | "grinder";

interface Tasting {
  id?: string;
  variable: TastingVariable;
  samples: TastingSample[];
  prepDone?: boolean;
  date: firebase.firestore.Timestamp | Date | null;
}

interface TastingSample {
  variableValue: string | firebase.firestore.DocumentReference;
  prep?: TastingPrep;
  rating?: TastingRating;
}

interface TastingPrep {
  id?: string;
  method: string;
  beans: firebase.firestore.DocumentReference | null;
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

interface TastingRating {
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

interface TastingScores {
  aroma: number;
  acidity: number;
  sweetness: number;
  body: number;
  finish: number;
}

interface ITastingNotes {
  name: string;
  children?: ITastingNotes[];
}

type Espresso = EspressoPrep & EspressoOutcome;

type Brew = BrewPrep & BrewOutcome;
