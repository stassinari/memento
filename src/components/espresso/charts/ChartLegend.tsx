import clsx from "clsx";
import { propertyToValues } from "./PressureFlowWeightChart";

interface LegendRectangleProps {
  color: string;
}

const LegendRectangle = ({ color }: LegendRectangleProps) => {
  return (
    <div
      className={clsx(["inline-block w-4 h-2 mr-4 rounded-sm"])}
      style={{
        backgroundColor: color,
      }}
    />
  );
};

export const ChartLegend = ({ payload }: any) => {
  return (
    <ul className="p-0 m-0 text-center">
      {payload.map((entry: any, index: any) => (
        <li
          key={`item-${index}`}
          className="mr-8 inline-flex list-none items-center text-xs text-gray-500 dark:text-gray-400"
        >
          <LegendRectangle color={entry.color} />
          {propertyToValues[entry.value].label}
        </li>
      ))}
    </ul>
  );
};
