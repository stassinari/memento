import { InputHTMLAttributes } from "react";
import "twin.macro";
import { Input } from "../Input";

interface FormInputProps {
  label: string;
  id: string;
  helperText?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  helperText,
  error,
  inputProps,
}) => {
  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      <div tw="mt-1">
        <Input
          type="text"
          id={id}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-description` : undefined
          }
          {...inputProps}
        />
      </div>
      {helperText && !error && (
        <Input.Helper id={`${id}-description`}>{helperText}</Input.Helper>
      )}
      {error && <Input.Error id={`${id}-error`}>{error}</Input.Error>}
    </div>
  );
};
