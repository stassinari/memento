import { RadioGroup } from "@headlessui/react";
import "twin.macro";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface FormRadioCardOption {
  name: string;
  ram: string;
  cpus: string;
  disk: string;
  price: string;
}

type FormRadioCardsProps<T> = {
  label: string;
  value: T;
  handleChange: (value: T) => void;
  options: FormRadioCardOption[];
};

export const FormRadioCards = <T,>({
  label,
  options,
  value,
  handleChange,
}: FormRadioCardsProps<T>) => {
  return (
    <RadioGroup value={value} onChange={handleChange}>
      <RadioGroup.Label>{label}</RadioGroup.Label>
      <div tw="space-y-4">
        {options.map((option) => (
          <RadioGroup.Option
            key={option.name}
            value={option}
            tw="relative block px-6 py-4 bg-white border rounded-lg shadow-sm cursor-pointer focus:outline-none sm:(flex justify-between) ui-active:(border-orange-500 ring-2 ring-orange-500) ui-checked:border-transparent ui-not-checked:border-gray-300"
          >
            <span tw="flex items-center">
              <span tw="flex flex-col text-sm">
                <RadioGroup.Label as="span" tw="font-medium text-gray-900">
                  {option.name}
                </RadioGroup.Label>
                <RadioGroup.Description as="span" tw="text-gray-500">
                  <span tw="block sm:inline">
                    {option.ram} / {option.cpus}
                  </span>{" "}
                  <span tw="hidden sm:(mx-1 inline)" aria-hidden="true">
                    &middot;
                  </span>{" "}
                  <span tw="block sm:inline">{option.disk}</span>
                </RadioGroup.Description>
              </span>
            </span>
            <RadioGroup.Description
              as="span"
              tw="flex mt-2 text-sm sm:(mt-0 ml-4 flex-col text-right)"
            >
              <span tw="font-medium text-gray-900">{option.price}</span>
              <span tw="ml-1 text-gray-500 sm:ml-0">/mo</span>
            </RadioGroup.Description>
            <span
              tw="absolute rounded-lg pointer-events-none -inset-px ui-active:border ui-not-active:border-2 ui-checked:border-orange-500 ui-not-checked:border-transparent"
              aria-hidden="true"
            />
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};
