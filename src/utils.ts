import { Brew } from "./types/brew";

export const getEyFromBrew = (brew: Brew) => {
  if (!brew.tds || !brew.finalBrewWeight || !brew.beansWeight) return 0;

  const tds = brew.tds;
  const weight =
    brew.extractionType === "immersion"
      ? brew.waterWeight
      : brew.finalBrewWeight;
  const dose = brew.beansWeight;

  return Math.floor(((tds * weight) / dose) * 100) / 100;
};
