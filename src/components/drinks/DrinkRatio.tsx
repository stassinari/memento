import "twin.macro";
import { BeanIcon } from "../icons/BeanIcon";
import { DropIcon } from "../icons/DropIcon";
import { useDrinkRatio } from "./useDrinkRatio";

interface DrinkRatioProps {
  beans: number;
  water: number;
  waterMeasurementUnit?: string;
}

export const DrinkRatio: React.FC<DrinkRatioProps> = ({
  beans,
  water,
  waterMeasurementUnit = "ml",
}) => {
  const [beansByWater, waterByBeans] = useDrinkRatio(beans, water);

  return (
    <div tw="text-gray-900 grid grid-cols-[30%_40%_30%]">
      <span tw="flex items-center gap-2 text-left">
        <BeanIcon tw="w-4 h-4 text-gray-400" />
        {beans}g
      </span>
      <div tw="flex flex-col text-center">
        <span>B2W: {beansByWater}</span>
        <span>W2B: {waterByBeans}</span>
      </div>
      <span tw="flex items-center justify-end gap-2">
        {water}
        {waterMeasurementUnit}
        <DropIcon tw="w-4 h-4 text-gray-400" />
      </span>
    </div>
  );
};
