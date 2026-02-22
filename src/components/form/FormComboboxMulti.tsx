import { ReactElement } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { immutableRemove } from "~/util";
import { ComboboxMulti } from "../Combobox/ComboboxMulti";

export interface FormComboboxMultiProps {
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
  renderOption?: (option: string) => ReactElement;
}

export const FormComboboxMulti = ({
  name,
  label,
  options,
  placeholder,
  renderOption,
}: FormComboboxMultiProps) => {
  const { control, getValues, setValue } = useFormContext();
  const removeItem = (item: string) => setValue(name, immutableRemove(getValues(name), item));

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <ComboboxMulti
          name={name}
          label={label}
          options={options}
          values={field.value}
          onChange={(newValues) => field.onChange(newValues)}
          placeholder={placeholder}
          removeItem={removeItem}
          renderOption={renderOption}
        />
      )}
    />
  );
};
