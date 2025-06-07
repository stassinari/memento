import { Combobox as HuiCombobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ReactElement, ReactNode } from "react";

// interface ComboboxInputProps {
//   placeholder?: string;
//   handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   displayValue?: (option: string) => string;
//   increasePadding?: boolean;
// }

// export const ComboboxInput = ({
//   placeholder,
//   handleChange,
//   displayValue = (option: string) => option,
//   increasePadding,
// }: ComboboxInputProps) => (
//   <HuiCombobox.Input
//     className={clsx([//       inputStyles,
//       "relative py-2 pl-3 pr-10 bg-white border focus:outline-hidden focus:ring-1",
//       increasePadding && "pr-16",
//])}
//     onChange={handleChange}
//     displayValue={displayValue}
//     autoComplete="off"
//     placeholder={placeholder}
//   />
// );

export const comboboxButtonStyles =
  "absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-hidden";

export const comboboxButtonIconStyles =
  "w-5 h-5 text-gray-400 hover:text-gray-600";

export const ComboboxButton = () => (
  <HuiCombobox.Button className={clsx(comboboxButtonStyles)}>
    <ChevronUpDownIcon className={clsx(comboboxButtonIconStyles)} />
  </HuiCombobox.Button>
);

interface ComboboxOptionsProps {
  children: ReactNode;
}

export const ComboboxOptions = ({ children }: ComboboxOptionsProps) => (
  <HuiCombobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
    {children}
  </HuiCombobox.Options>
);

interface ComboboxOptionProps {
  option: string;
  renderOption: (option: string) => ReactElement;
  handleClick?: () => void;
}

export const ComboboxOption = ({
  option,
  renderOption,
  handleClick,
}: ComboboxOptionProps) => (
  <HuiCombobox.Option
    key={option}
    value={option}
    className="relative py-2 pl-3 cursor-default select-none pr-9 ui-active:bg-orange-600 ui-active:text-white ui-not-active:text-gray-900"
    onClick={handleClick}
  >
    {({ selected }) => (
      <>
        <div className="flex items-center">{renderOption(option)}</div>

        {selected && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 ui-not-active:text-orange-600">
            <CheckIcon
              className="w-5 h-5 ui-active:text-white"
              aria-hidden="true"
            />
          </span>
        )}
      </>
    )}
  </HuiCombobox.Option>
);
