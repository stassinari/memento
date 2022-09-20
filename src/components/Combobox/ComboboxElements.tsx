import { Combobox as HuiCombobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { ReactElement, ReactNode } from "react";
import tw from "twin.macro";

// interface ComboboxInputProps {
//   placeholder?: string;
//   handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   displayValue?: (option: string) => string;
//   increasePadding?: boolean;
// }

// export const ComboboxInput: React.FC<ComboboxInputProps> = ({
//   placeholder,
//   handleChange,
//   displayValue = (option: string) => option,
//   increasePadding,
// }) => (
//   <HuiCombobox.Input
//     css={[
//       inputStyles,
//       tw`relative py-2 pl-3 pr-10 bg-white border focus:(outline-none ring-1)`,
//       increasePadding && tw`pr-16`,
//     ]}
//     onChange={handleChange}
//     displayValue={displayValue}
//     autoComplete="off"
//     placeholder={placeholder}
//   />
// );

export const comboboxButtonStyles = tw`absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none`;

export const comboboxButtonIconStyles = tw`w-5 h-5 text-gray-400 hover:text-gray-600`;

export const ComboboxButton = () => (
  <HuiCombobox.Button css={comboboxButtonStyles}>
    <ChevronUpDownIcon css={comboboxButtonIconStyles} />
  </HuiCombobox.Button>
);

interface ComboboxOptionsProps {
  children: ReactNode;
}

export const ComboboxOptions: React.FC<ComboboxOptionsProps> = ({
  children,
}) => (
  <HuiCombobox.Options tw="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
    {children}
  </HuiCombobox.Options>
);

interface ComboboxOptionProps {
  option: string;
  renderOption: (option: string) => ReactElement;
  handleClick?: VoidFunction;
}

export const ComboboxOption: React.FC<ComboboxOptionProps> = ({
  option,
  renderOption,
  handleClick,
}) => (
  <HuiCombobox.Option
    key={option}
    value={option}
    tw="relative py-2 pl-3 cursor-default select-none pr-9 ui-active:(bg-orange-600 text-white) ui-not-active:text-gray-900"
    onClick={handleClick}
  >
    {({ selected }) => (
      <React.Fragment>
        <div tw="flex items-center">{renderOption(option)}</div>

        {selected && (
          <span tw="absolute inset-y-0 right-0 flex items-center pr-4 ui-not-active:text-orange-600">
            <CheckIcon tw="w-5 h-5 ui-active:text-white" aria-hidden="true" />
          </span>
        )}
      </React.Fragment>
    )}
  </HuiCombobox.Option>
);
