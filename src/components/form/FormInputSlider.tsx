import { Controller, useFormContext } from "react-hook-form";

import { Input } from "../Input";
import { InputSlider, InputSliderProps } from "../InputSlider";

interface FormInputSlider extends Omit<InputSliderProps, "values" | "onChange"> {
  label: string;
  id: string;
  helperText?: string;
}

export const FormInputSlider = ({ label, id, ...rest }: FormInputSlider) => {
  const { control } = useFormContext();

  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      <div className="mt-3">
        <Controller
          control={control}
          name={id}
          render={({ field }) => (
            <InputSlider
              values={[field.value]}
              onChange={(values) => field.onChange(values[0])}
              {...rest}
            />
          )}
        />
      </div>
    </div>
  );
};
