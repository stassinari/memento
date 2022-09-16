import { RadioGroup } from "@headlessui/react";
import tw from "twin.macro";
import { labelStyles } from "./Input";
import { RadioOption } from "./InputRadio";

export interface InputRadioCardProps {
  label: string;
  options: RadioOption[];
  value: any;
  onChange: (...event: any[]) => void;
}

export const InputRadioCard: React.FC<InputRadioCardProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <RadioGroup value={value} onChange={onChange} tw="mt-2">
      <RadioGroup.Label css={labelStyles}>{label}</RadioGroup.Label>
      <div tw="inline-flex mt-1 ">
        {/* <div tw="grid grid-cols-3 gap-3 mt-1 sm:grid-cols-6"> */}
        {options.map((option) => (
          <RadioGroup.Option
            key={option.label}
            value={option.value}
            css={[
              tw`flex items-center justify-center px-5 py-2 text-sm font-medium border focus:z-10 first:rounded-l-md last:rounded-r-md not-first:-ml-px`,
              tw`ui-active:(ring-2 ring-offset-2 ring-orange-500) ui-checked:(bg-orange-600 border-transparent text-white hover:bg-orange-700) ui-not-checked:(bg-white border-gray-200 text-gray-700 hover:bg-gray-50)`,
              option.disabled
                ? tw`opacity-25 cursor-not-allowed`
                : tw`cursor-pointer focus:outline-none`,
            ]}
            disabled={option.disabled}
          >
            <RadioGroup.Label as="span">{option.label}</RadioGroup.Label>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};
