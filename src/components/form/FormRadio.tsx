import { InputHTMLAttributes } from "react";
import "twin.macro";
import { Input } from "../Input";
import { InputRadio, RadioOption } from "../InputRadio";

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
      {helperText && (
        <Input.Helper id={`${id}-description`} tw="mt-0.5">
          {helperText}
        </Input.Helper>
      )}

      <InputRadio label={label} inputProps={inputProps} options={options} />

      {error && <Input.Error id={`${id}-error`}>{error}</Input.Error>}
    </div>
  );
};
