import { Controller, useFormContext } from "react-hook-form";
import "twin.macro";
import { Input } from "../Input";
import { InputRange, InputRangeProps } from "../InputRange";

interface FormInputRange extends Omit<InputRangeProps, "values" | "onChange"> {
  label: string;
  id: string;
  helperText?: string;
}

export const FormInputRange: React.FC<FormInputRange> = ({
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
            <InputRange
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
