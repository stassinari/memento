import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../Input";
import { InputRadioCards, InputRadioCardsProps } from "../InputRadioCards";

type FormInputRadioCardsProps<T> = Pick<
  InputRadioCardsProps<T>,
  "label" | "options"
> & {
  name: string;
  error?: string;
  requiredMsg?: string;
};

export const FormInputRadioCards = <T,>({
  name,
  requiredMsg,
  error,
  ...rest
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
            {...rest}
            currentValue={field.value}
            handleChange={(newValue) => field.onChange(newValue)}
          />
        )}
      />

      {error && <Input.Error id={`${name}-error`}>{error}</Input.Error>}
    </div>
  );
};
