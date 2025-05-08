import { InputHTMLAttributes } from "react";

import { Input } from "../Input";
import { InputRadio, RadioDirection, RadioOption } from "../InputRadio";

interface FormInputRadioProps {
  label: string;
  id: string;
  options: RadioOption[];
  direction: RadioDirection;
  helperText?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  error?: string;
}

export const FormInputRadio: React.FC<FormInputRadioProps> = ({
  label,
  id,
  options,
  direction,
  inputProps,
  helperText,
  error,
}) => {
  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      {helperText && (
        <Input.Helper id={`${id}-description`} className="mt-0.5">
          {helperText}
        </Input.Helper>
      )}

      <InputRadio
        label={label}
        inputProps={inputProps}
        options={options}
        direction={direction}
      />

      {error && <Input.Error id={`${id}-error`}>{error}</Input.Error>}
    </div>
  );
};
