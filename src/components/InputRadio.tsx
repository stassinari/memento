import { InputHTMLAttributes } from "react";
import "twin.macro";

export type RadioOption = {
  value: string;
  label: string;
};

interface InputRadioProps {
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  options: RadioOption[];
}

export const InputRadio: React.FC<InputRadioProps> = ({
  label,
  inputProps,
  options,
}) => {
  return (
    <fieldset tw="mt-3">
      <legend tw="sr-only">{label}</legend>
      <div tw="space-y-4 sm:(flex items-center space-y-0 space-x-10)">
        {options.map(({ value, label }) => (
          <div key={value} tw="flex items-center">
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
