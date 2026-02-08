import { BeanIconSolid } from "../icons/BeanIconSolid";
import { DropIcon } from "../icons/DropIcon";
import { useDrinkRatio } from "./useDrinkRatio";

interface DrinkRatioProps {
  beans: number;
  water: number;
  waterMeasurementUnit?: string;
}

export const DrinkRatio = ({
  beans,
  water,
  waterMeasurementUnit = "ml",
}: DrinkRatioProps) => {
  const { beansByWater, waterByBeans } = useDrinkRatio(beans, water);

  return (
    <div className="text-gray-900 grid grid-cols-[30%_40%_30%]">
      <span className="flex items-center gap-2 text-left">
        <BeanIconSolid className="w-4 h-4 text-gray-400" />
        {beans}g
      </span>
      <div className="flex flex-col text-center">
        <span>B2W: {beansByWater}</span>
        <span>W2B: {waterByBeans}</span>
      </div>
      <span className="flex items-center justify-end gap-2">
        {water}
        {waterMeasurementUnit}
        <DropIcon className="w-4 h-4 text-gray-400" />
      </span>
    </div>
  );
};
