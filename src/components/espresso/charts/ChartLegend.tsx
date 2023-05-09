import { css } from "@emotion/react";
import tw from "twin.macro";
import { propertyToValues } from "./PressureFlowWeightChart";

interface LegendRectangleProps {
  color: string;
}

const LegendRectangle: React.FC<LegendRectangleProps> = ({ color }) => {
  return (
    <div
      css={[
        tw`inline-block w-4 h-2 mr-4 rounded`,
        css`
          background-color: ${color};
        `,
      ]}
    />
  );
};

export const ChartLegend = ({ payload }: any) => {
  return (
    <ul tw="p-0 m-0 text-center">
      {payload.map((entry: any, index: any) => (
        <li
          key={`item-${index}`}
          tw="inline-flex items-center mr-8 text-xs text-gray-500 list-none"
        >
          <LegendRectangle color={entry.color} />
          {propertyToValues[entry.value].label}
        </li>
      ))}
    </ul>
  );
};
