export const useDrinkRatio = (
  beansWeight: number,
  waterWeight: number,
  options?: {
    beansByWaterFactor?: number;
    waterByBeansFactor?: number;
  }
): { beansByWater: string; waterByBeans: string } => {
  let beansByWater = 0;
  let waterByBeans = 0;
  const beansByWaterFactor = options?.beansByWaterFactor ?? 10;
  const waterByBeansFactor = options?.waterByBeansFactor ?? 10;

  if (waterWeight && beansWeight) {
    beansByWater =
      Math.floor((beansWeight / (waterWeight / 1000)) * beansByWaterFactor) /
      beansByWaterFactor;
    waterByBeans =
      Math.floor((waterWeight / beansWeight) * waterByBeansFactor) /
      waterByBeansFactor;
  }

  return {
    beansByWater: `${beansByWater} g/l`,
    waterByBeans: `1 : ${waterByBeans}`,
  };
};
