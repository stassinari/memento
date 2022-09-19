import { Timestamp } from "firebase/firestore";

export type RoastStyle = "filter" | "espresso" | "omni-roast";
export type Origin = "single-origin" | "blend";

export type Beans = BeansCommon & BeansSingleOrigin & BeansBlend;

interface BeansCommon {
  id?: string;
  name: string;
  isFinished?: boolean;
  roaster: string;
  roastDate: Timestamp | null;
  roastStyle: RoastStyle | null;
  roastLevel: number | null;
  roastingNotes: never[];
  origin: Origin;
  freezeDate: Timestamp | null;
  thawDate: Timestamp | null;
}

interface BeansSingleOrigin {
  country: string | null;
  region: string | null;
  varietals: string[];
  altitude: number | null;
  process: string | null;
  farmer: string | null;
  harvestDate: Timestamp | null;
}

interface BeansBlend {
  blend?: BeansBlendPart[];
}

export interface BeansBlendPart {
  name?: string;
  country?: string;
  varietals?: string[];
  percentage?: number;
  process?: string;
}
