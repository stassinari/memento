import { Controller, useFormContext } from "react-hook-form";

import { Input } from "../Input";
import { InputRadioCards, InputRadioCardsProps } from "../InputRadioCards";

type FormInputRadioCardsProps<T> = Pick<InputRadioCardsProps<T>, "label" | "options"> & {
  name: string;
  error?: string;
  requiredMsg?: string;
  onChange?: () => void;
};

export const FormInputRadioCards = <T,>({
  name,
  requiredMsg,
  error,
  options,
  label,
  onChange,
}: FormInputRadioCardsProps<T>) => {
  const { control } = useFormContext();

  return (
    <div>
      <Controller
        control={control}
        name={name}
        rules={{ required: requiredMsg }}
        render={({ field }) => (
          <InputRadioCards
            options={options}
            label={label}
            currentValue={field.value}
            handleChange={(newValue) => {
              field.onChange(newValue);

              if (onChange) {
                onChange();
              }
            }}
          />
        )}
      />

      {error && <Input.Error id={`${name}-error`}>{error}</Input.Error>}
    </div>
  );
};
