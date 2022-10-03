import React, { ReactElement } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ComboboxSingle } from "../Combobox/ComboboxSingle";
import { Input } from "../Input";
import { FormSuggestions } from "./FormSuggestions";

export interface FormComboboxSingleProps {
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
  renderOption?: (option: string) => ReactElement;
  requiredMsg?: string;
  error?: string;
  suggestions?: string[];
}

export const FormComboboxSingle: React.FC<FormComboboxSingleProps> = ({
  name,
  label,
  options,
  placeholder,
  renderOption,
  requiredMsg,
  error,
  suggestions,
}) => {
  const { control, resetField, setValue } = useFormContext();
  return (
    <div>
      <Controller
        control={control}
        name={name}
        rules={{ required: requiredMsg }}
        render={({ field }) => (
          <ComboboxSingle
            name={name}
            label={label}
            options={options}
            value={field.value}
            onChange={(newValue) => field.onChange(newValue)}
            reset={() => resetField(name, { defaultValue: null })}
            placeholder={placeholder}
            renderOption={renderOption}
          />
        )}
      />
      {suggestions && (
        <FormSuggestions
          suggestions={suggestions.map((s) => ({
            label: s,
            onClick: () => setValue(name, s),
          }))}
        />
      )}
      {error && <Input.Error id={`${name}-error`}>{error}</Input.Error>}
    </div>
  );
};
