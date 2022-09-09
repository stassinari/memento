import { InputHTMLAttributes } from "react";
import "twin.macro";
import { Input } from "../Input";

type RadioOption = {
  value: string;
  label: string;
};

interface FormRadioProps {
  label: string;
  id: string;
  options: RadioOption[];
  helperText?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  error?: string;
}

export const FormRadio: React.FC<FormRadioProps> = ({
  label,
  id,
  options,
  inputProps,
  helperText,
  error,
}) => {
  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      {helperText && !error && (
        <Input.Helper id={`${id}-description`} tw="mt-0.5">
          {helperText}
        </Input.Helper>
      )}
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

      {error && <Input.Error id={`${id}-error`}>{error}</Input.Error>}
    </div>
  );
};
