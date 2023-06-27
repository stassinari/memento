import { InputHTMLAttributes } from "react";
import tw from "twin.macro";

export type RadioDirection = "vertical" | "horizontal";

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface InputRadioProps {
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  direction: RadioDirection;
  options: RadioOption[];
}

export const InputRadio: React.FC<InputRadioProps> = ({
  label,
  direction,
  inputProps,
  options,
}) => {
  return (
    <fieldset tw="mt-3">
      <legend tw="sr-only">{label}</legend>
      <div
        tw=""
        css={[
          direction === "vertical"
            ? tw`flex flex-col space-y-4`
            : tw`flex space-x-10 items-center`,
        ]}
      >
        {options.map(({ value, label }) => (
          <div key={label} tw="flex items-center">
            <input
              {...inputProps}
              id={value}
              value={value}
              type="radio"
              tw="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
            />
            <label htmlFor={value} tw="block ml-3 text-sm text-gray-900">
              {label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
