import { ReactElement } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ComboboxSingle } from "../Combobox/ComboboxSingle";

export interface FormComboboxProps {
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
  renderOption?: (option: string) => ReactElement;
}

export const FormCombobox: React.FC<FormComboboxProps> = ({
  name,
  label,
  options,
  placeholder,
  renderOption,
}) => {
  const { control } = useFormContext();
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
          placeholder={placeholder}
          renderOption={renderOption}
        />
      )}
    />
  );
};
