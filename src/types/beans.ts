import { Timestamp } from "firebase/firestore";

export type RoastStyle = "filter" | "espresso" | "omni-roast";
export type Origin = "single-origin" | "blend";

export type Beans = BeansSingleOrigin | BeansBlend;

export type BeansSingleOrigin = BeansCommon & TerroirSingleOrigin;
export type BeansBlend = BeansCommon & TerroirBlend;

interface BeansCommon {
  id?: string;

  name: string;
  roaster: string;
  roastDate: Timestamp | null;
  roastStyle: RoastStyle | null;
  roastLevel: number | null;
  roastingNotes: string[];

  freezeDate: Timestamp | null;
  thawDate: Timestamp | null;

  isFinished?: boolean;
}

export interface BeansBlendPart {
  name: string | null;
  country: string | null;
  varietals: string[];
  percentage: number | null;
  process: string | null;
}

interface TerroirSingleOrigin {
  origin: "single-origin";
  country: string | null;
  region: string | null;
  varietals: string[];
  altitude: number | null;
  process: string | null;
  farmer: string | null;
  harvestDate: Timestamp | null;
}

interface TerroirBlend {
  origin: "blend";
  blend: BeansBlendPart[];
}
