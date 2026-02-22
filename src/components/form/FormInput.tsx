import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "../Input";
import { FormSuggestions } from "./FormSuggestions";

interface FormInputProps {
  label: string;
  id: string;
  helperText?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  suggestions?: string[];
}

export const FormInput = ({
  label,
  id,
  helperText,
  error,
  inputProps,
  suggestions,
}: FormInputProps) => {
  const { setValue } = useFormContext();

  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      <div className="mt-1">
        <Input
          type="text"
          id={id}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-description` : undefined}
          {...inputProps}
        />
      </div>
      {suggestions && (
        <FormSuggestions
          suggestions={suggestions.map((s) => ({
            label: s,
            onClick: () => setValue(id, s),
          }))}
        />
      )}
      {helperText && !error && <Input.Helper id={`${id}-description`}>{helperText}</Input.Helper>}
      {error && <Input.Error id={`${id}-error`}>{error}</Input.Error>}
    </div>
  );
};
