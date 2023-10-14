export const useDrinkRatio = (
  beansWeight: number,
  waterWeight: number
): { beansByWater: string; waterByBeans: string } => {
  let beansByWater = 0;
  let waterByBeans = 0;

  if (waterWeight && beansWeight) {
    beansByWater = Math.floor((beansWeight / (waterWeight / 1000)) * 10) / 10;
    waterByBeans = Math.floor((waterWeight / beansWeight) * 10) / 10;
  }

  return {
    beansByWater: `${beansByWater} g/l`,
    waterByBeans: `1 : ${waterByBeans}`,
  };
};
