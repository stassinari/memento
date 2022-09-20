import { ReactElement } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ComboboxSingle } from "../Combobox/ComboboxSingle";

export interface FormComboboxSingleProps {
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
  renderOption?: (option: string) => ReactElement;
}

export const FormComboboxSingle: React.FC<FormComboboxSingleProps> = ({
  name,
  label,
  options,
  placeholder,
  renderOption,
}) => {
  const { control, resetField } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
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
  );
};
