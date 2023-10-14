export const useDrinkRatio = (
  beansWeight: number,
  waterWeight: number
): [string, string] => {
  let beansByWaterRatio = 0;
  let waterByBeansRatio = 0;

  if (waterWeight && beansWeight) {
    beansByWaterRatio =
      Math.floor((beansWeight / (waterWeight / 1000)) * 10) / 10;
    waterByBeansRatio = Math.floor((waterWeight / beansWeight) * 10) / 10;
  }

  return [`${beansByWaterRatio} g/l`, `1 : ${waterByBeansRatio}`];
};
