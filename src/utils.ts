import { Espresso } from "./types/espresso";

interface BrewEyData {
  tds: number;
  finalBrewWeight: number;
  beansWeight: number;
  extractionType: string | null;
  waterWeight: number;
}

export const getEyFromBrew = (data: BrewEyData) => {
  const tds = data.tds;
  const weight =
    data.extractionType === "immersion"
      ? data.waterWeight
      : data.finalBrewWeight;
  const dose = data.beansWeight;

  return calculateEy({ tds, weight: weight || 0, dose });
};

export const getEyFromEspresso = (espresso: Espresso) => {
  if (
    !espresso.tds ||
    !(!!espresso.actualWeight || !!espresso.targetWeight) ||
    !espresso.beansWeight
  )
    return 0;

  const tds = espresso.tds!;
  const weight = (espresso.actualWeight ?? espresso.targetWeight)!;
  const dose = espresso.beansWeight!;

  return calculateEy({ tds, weight, dose });
};

interface EyVariables {
  tds: number;
  weight: number;
  dose: number;
}

const calculateEy = ({ tds, weight, dose }: EyVariables) =>
  Math.floor(((tds * weight) / dose) * 100) / 100;

export const roundToDecimal = (n?: number, decimal = 1) =>
  n ? Math.round(n * (10 * decimal)) / (10 * decimal) : 0;

export const generateRandomString = (len: number = 16) =>
  Array(len)
    .fill(0)
    .map((x) => Math.random().toString(36).charAt(2))
    .join("");
