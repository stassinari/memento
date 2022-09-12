import { Controller, useFormContext } from "react-hook-form";
import { Combobox } from "../Combobox";

export interface FormComboboxProps {
  name: string;
  label: string;
  options: string[];
}

export const FormCombobox: React.FC<FormComboboxProps> = ({
  name,
  label,
  options,
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Combobox
          name={name}
          label={label}
          options={options}
          value={field.value}
          onChange={(newValue) => field.onChange(newValue)}
        />
      )}
    />
  );
};
