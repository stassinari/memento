import { css } from "@emotion/react";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import tw from "twin.macro";
import { propertyToValues } from "../../../pages/espresso/PressureFlowWeightChart";
import { roundToDecimal } from "../../../utils";

interface CustomTooltipProps {
  title: number;
  payload?: Payload<ValueType, NameType>[];
}

interface CircleProps {
  color: string;
}

const Circle: React.FC<CircleProps> = ({ color }) => {
  return (
    <div
      css={[
        tw`inline-block w-2.5 h-2.5 rounded-full mr-1`,
        css`
          background-color: ${color};
        `,
      ]}
    />
  );
};

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  title,
  payload,
}) => {
  if (!payload) {
    return null;
  }

  return (
    <div tw="p-2 bg-white rounded shadow-md opacity-75">
      <table>
        <thead>
          <tr tw="p-0 text-sm text-left text-gray-700">
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
              <tr key={p.name} tw="p-0 text-sm leading-4 text-gray-600">
                <td tw="pr-2">{property.label}:</td>
                <td>
                  <Circle color={p.color} />
                  <strong tw="text-gray-700">
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
