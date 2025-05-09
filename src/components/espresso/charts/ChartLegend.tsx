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
          className="inline-flex items-center mr-8 text-xs text-gray-500 list-none"
        >
          <LegendRectangle color={entry.color} />
          {propertyToValues[entry.value].label}
        </li>
      ))}
    </ul>
  );
};
