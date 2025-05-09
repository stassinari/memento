import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { labelStyles } from "./Input";
import { RadioOption } from "./InputRadio";

export interface InputRadioButtonGroupProps {
  label: string;
  options: RadioOption[];
  value: any;
  onChange: (...event: any[]) => void;
  variant?: "primary" | "secondary";
}

export const InputRadioButtonGroup = ({
  label,
  options,
  value,
  onChange,
  variant = "primary",
}: InputRadioButtonGroupProps) => {
  return (
    <RadioGroup value={value} onChange={onChange} className="mt-2">
      <RadioGroup.Label className={clsx(labelStyles)}>{label}</RadioGroup.Label>
      <div className="inline-flex mt-1 ">
        {options.map((option) => (
          <RadioGroup.Option
            key={option.label}
            value={option.value}
            className={clsx([
              "flex items-center justify-center px-5 py-2 text-sm font-medium border focus:z-10 first-of-type:rounded-l-md last-of-type:rounded-r-md not-first-of-type:-ml-px",
              "ui-active:ring-orange-500",
              "ui-not-checked:bg-white ui-not-checked:border-gray-200 ui-not-checked:text-gray-700 hover:ui-not-checked:bg-gray-50",
              variant === "primary"
                ? "ui-checked:bg-orange-600 ui-checked:border-transparent ui-checked:text-white hover:ui-checked:bg-orange-700 ui-active:ring-2 ui-active:ring-offset-2"
                : variant === "secondary"
                  ? "ui-checked:text-orange-700 ui-checked:bg-orange-100 ui-checked:border-transparent hover:ui-checked:bg-orange-200 focus:ui-not-checked:border-orange-500 ui-active:ring-1 ui-active:border-orange-500"
                  : null,
              option.disabled
                ? "opacity-25 cursor-not-allowed"
                : "cursor-pointer focus:outline-hidden",
            ])}
            disabled={option.disabled}
          >
            <RadioGroup.Label as="span">{option.label}</RadioGroup.Label>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};
