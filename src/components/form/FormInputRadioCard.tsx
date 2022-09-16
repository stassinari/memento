import { Controller, useFormContext } from "react-hook-form";
import { RadioOption } from "../InputRadio";
import { InputRadioCard } from "../InputRadioCard";

interface FormInputRadioCardProps {
  name: string;
  label: string;
  options: RadioOption[];
}

export const FormInputRadioCard: React.FC<FormInputRadioCardProps> = ({
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
        <InputRadioCard
          label={label}
          options={options}
          value={field.value}
          onChange={(newValue) => field.onChange(newValue)}
        />
      )}
    />
  );
};
