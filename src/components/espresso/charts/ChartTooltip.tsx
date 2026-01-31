import clsx from "clsx";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { roundToDecimal } from "~/utils";
import { propertyToValues } from "./PressureFlowWeightChart";

interface CustomTooltipProps {
  title: number;
  payload?: Payload<ValueType, NameType>[];
}

interface CircleProps {
  color: string;
}

const Circle = ({ color }: CircleProps) => {
  return (
    <div
      className={clsx(["inline-block w-2.5 h-2.5 rounded-full mr-1"])}
      style={{
        backgroundColor: color,
      }}
    />
  );
};

export const ChartTooltip = ({ title, payload }: CustomTooltipProps) => {
  if (!payload) {
    return null;
  }

  return (
    <div className="p-2 bg-white rounded-sm shadow-md opacity-75">
      <table>
        <thead>
          <tr className="p-0 text-sm text-left text-gray-700">
            <th colSpan={2}>t={roundToDecimal(title)}s</th>
          </tr>
        </thead>
        <tbody>
          {payload.map((p) => {
            const property = propertyToValues[p.name];
            if (!p.value || p.value < 0) {
              return null;
            }
            return (
              <tr key={p.name} className="p-0 text-sm leading-4 text-gray-600">
                <td className="pr-2">{property.label}:</td>
                <td>
                  <Circle color={p.color} />
                  <strong className="text-gray-700">
                    {roundToDecimal(p.value as number)}
                  </strong>
                  {property.unit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
