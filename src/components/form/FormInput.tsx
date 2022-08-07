import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import "twin.macro";
import { Input } from "../Input";

interface FormInputProps {
  label: string;
  name: string;
  placeholder?: string;
  helperText?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;

  error?: FieldError;
  register?: any;
  requiredMsg?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  register,
  label,
  name,
  placeholder,
  helperText,
  requiredMsg: required,
  error,
  inputProps,
}) => {
  return (
    <div>
      <Input.Label htmlFor={name}>{label}</Input.Label>
      <div tw="mt-1">
        <Input
          {...register(name, { required })}
          type="text"
          name={name}
          placeholder={placeholder}
          id={name}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${name}-error`
              : helperText
              ? `${name}-description`
              : undefined
          }
          {...inputProps}
        />
      </div>
      {helperText && !error && (
        <Input.Helper id={`${name}-description`}>{helperText}</Input.Helper>
      )}
      {error && <Input.Error id={`${name}-error`}>{error.message}</Input.Error>}
    </div>
  );
};
