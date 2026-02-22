import { Controller, useFormContext } from "react-hook-form";
import { InputRadioButtonGroup, InputRadioButtonGroupProps } from "../InputRadioButtonGroup";

interface FormInputRadioButtonGroupProps extends Pick<
  InputRadioButtonGroupProps,
  "label" | "options" | "variant"
> {
  name: string;
}

export const FormInputRadioButtonGroup: React.FC<FormInputRadioButtonGroupProps> = ({
  name,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <InputRadioButtonGroup
          {...rest}
          value={field.value}
          onChange={(newValue) => field.onChange(newValue)}
        />
      )}
    />
  );
};
