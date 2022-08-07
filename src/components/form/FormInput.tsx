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
      <label htmlFor={label} tw="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div tw="mt-1">
        <Input
          {...register(name, { required })}
          type="text"
          name={name}
          placeholder={placeholder}
          id={name}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${name}-description`}
          {...inputProps}
        />
      </div>
      {helperText && !error && (
        <p tw="mt-2 text-sm text-gray-500" id={`${name}-description`}>
          {helperText}
        </p>
      )}
      {error && (
        <label role="alert">
          <span>{error.message}</span>
        </label>
      )}
    </div>
  );
};
