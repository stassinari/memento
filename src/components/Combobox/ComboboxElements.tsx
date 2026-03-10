import {
  ComboboxButton as HuiComboboxButton,
  ComboboxOption as HuiComboboxOption,
  ComboboxOptions as HuiComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ReactElement, ReactNode } from "react";
import {
  pickerAbsoluteMenuStyles,
  pickerOptionBaseStyles,
  pickerOptionCheckStyles,
  pickerRightIconButtonStyles,
  pickerRightIconStyles,
} from "./sharedStyles";

export const comboboxButtonStyles = pickerRightIconButtonStyles;

export const comboboxButtonIconStyles = pickerRightIconStyles;

export const ComboboxButton = () => (
  <HuiComboboxButton className={clsx(comboboxButtonStyles)}>
    <ChevronUpDownIcon className={clsx(comboboxButtonIconStyles)} />
  </HuiComboboxButton>
);

interface ComboboxOptionsProps {
  children: ReactNode;
}

export const ComboboxOptions = ({ children }: ComboboxOptionsProps) => (
  <HuiComboboxOptions transition className={pickerAbsoluteMenuStyles}>
    {children}
  </HuiComboboxOptions>
);

interface ComboboxOptionProps {
  option: string;
  renderOption: (option: string) => ReactElement;
  handleClick?: () => void;
}

export const ComboboxOption = ({ option, renderOption, handleClick }: ComboboxOptionProps) => (
  <HuiComboboxOption
    key={option}
    value={option}
    className={clsx(pickerOptionBaseStyles, "pl-3")}
    onClick={handleClick}
  >
    <div className="flex items-center">{renderOption(option)}</div>

    <span className={pickerOptionCheckStyles}>
      <CheckIcon className="w-5 h-5" aria-hidden="true" />
    </span>
  </HuiComboboxOption>
);
