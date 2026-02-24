import clsx from "clsx";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { roundToDecimal } from "~/utils";
import { propertyToValues } from "./PressureFlowWeightChart";

interface CustomTooltipProps {
  title: number;
  // FIXME need to type this properly, but first need to update the charting library
  // @ts-ignore
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
    <div className="rounded-sm bg-white p-2 opacity-90 shadow-md dark:bg-gray-900 dark:ring-1 dark:ring-white/10">
      <table>
        <thead>
          <tr className="p-0 text-left text-sm text-gray-700 dark:text-gray-200">
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
              <tr key={p.name} className="p-0 text-sm leading-4 text-gray-600 dark:text-gray-300">
                <td className="pr-2">{property.label}:</td>
                <td>
                  <Circle color={p.color} />
                  <strong className="text-gray-700 dark:text-gray-200">
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
