import { Brew } from "./types/brew";
import { Espresso } from "./types/espresso";

export const getEyFromBrew = (brew: Brew) => {
  if (!brew.tds || !brew.finalBrewWeight || !brew.beansWeight) return 0;

  const tds = brew.tds;
  const weight =
    brew.extractionType === "immersion"
      ? brew.waterWeight
      : brew.finalBrewWeight;
  const dose = brew.beansWeight;

  return calculateEy({ tds, weight, dose });
};

export const getEyFromEspresso = (espresso: Espresso) => {
  if (
    !espresso.tds ||
    !(!!espresso.actualWeight || !!espresso.targetWeight) ||
    !espresso.beansWeight
  )
    return 0;

  const tds = espresso.tds;
  const weight = espresso.actualWeight ?? espresso.targetWeight;
  const dose = espresso.beansWeight;

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
