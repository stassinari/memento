import { RadioGroup } from "@headlessui/react";
import { ReactNode } from "react";

import clsx from "clsx";
import { labelStyles } from "./Input";

interface CopyBlock {
  top: ReactNode;
  bottom?: ReactNode;
}
export interface InputRadioCardsOption {
  value: string; // maybe open it up more?
  left: CopyBlock;
  right?: Partial<CopyBlock>;
}

export type InputRadioCardsProps<T> = {
  label: string;
  currentValue: T;
  handleChange: (value: T) => void;
  options: InputRadioCardsOption[];
};

export const InputRadioCards = <T,>({
  label,
  options,
  currentValue,
  handleChange,
}: InputRadioCardsProps<T>) => {
  return (
    <RadioGroup value={currentValue} onChange={handleChange}>
      <RadioGroup.Label className={clsx(labelStyles)}>{label}</RadioGroup.Label>
      <div className="mt-3 space-y-4">
        {options.map((option) => (
          <RadioGroup.Option
            key={option.value}
            value={option.value}
            className="relative block px-6 py-4 bg-white border rounded-lg shadow-sm cursor-pointer focus:outline-none sm:flex sm:justify-between ui-checked:border-orange-500 ui-checked:ring-2 ui-checked:ring-orange-500 ui-not-checked:border-gray-300"
          >
            <span className="flex items-center">
              <span className="flex flex-col text-sm">
                <RadioGroup.Label
                  as="span"
                  className="font-medium text-gray-900"
                >
                  {option.left.top}
                </RadioGroup.Label>
                {option.left.bottom && (
                  <RadioGroup.Description as="span" className="text-gray-500">
                    {option.left.bottom}
                  </RadioGroup.Description>
                )}
              </span>
            </span>
            {option.right && (
              <RadioGroup.Description
                as="span"
                className="flex flex-col-reverse text-sm sm:mt-0 sm:ml-4 sm:flex-col sm:text-right"
              >
                <span className="font-medium text-gray-500">
                  {option.right.top || (
                    <span className="hidden sm:block">&nbsp;</span>
                  )}
                </span>
                {option.right.bottom && (
                  <span className="text-gray-500">{option.right.bottom}</span>
                )}
              </RadioGroup.Description>
            )}
            <span
              className="absolute rounded-lg pointer-events-none -inset-px ui-active:border ui-not-active:border-2 ui-checked:border-orange-500 ui-not-checked:border-transparent"
              aria-hidden="true"
            />
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};
