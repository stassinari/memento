import { Controller, useFormContext } from "react-hook-form";
import "twin.macro";
import { Input } from "../Input";
import { InputSlider, InputSliderProps } from "../InputSlider";

interface FormInputSlider
  extends Omit<InputSliderProps, "values" | "onChange"> {
  label: string;
  id: string;
  helperText?: string;
}

export const FormInputSlider: React.FC<FormInputSlider> = ({
  label,
  id,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      <div tw="mt-3">
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
