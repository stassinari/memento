import clsx from "clsx";
import { InputHTMLAttributes } from "react";

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

export const InputRadio = ({
  label,
  direction,
  inputProps,
  options,
}: InputRadioProps) => {
  return (
    <fieldset className="mt-3">
      <legend className="sr-only">{label}</legend>
      <div
        className={clsx([
          direction === "vertical"
            ? "flex flex-col space-y-4"
            : "flex space-x-10 items-center",
        ])}
      >
        {options.map(({ value, label }) => (
          <div key={label} className="flex items-center">
            <input
              {...inputProps}
              id={value}
              value={value}
              type="radio"
              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
            />
            <label htmlFor={value} className="block ml-3 text-sm text-gray-900">
              {label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
