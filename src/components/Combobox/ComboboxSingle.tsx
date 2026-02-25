import { Combobox as HuiCombobox } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ReactElement, useState } from "react";
import { inputStyles, labelStyles } from "../Input";
import { TextOption } from "../form/ListOption";
import {
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
  comboboxButtonIconStyles,
  comboboxButtonStyles,
} from "./ComboboxElements";

export interface ComboboxSingleProps {
  name: string;
  label: string;
  options: string[];
  value: any;
  onChange: (...event: any[]) => void;
  reset: () => void;
  placeholder?: string;
  renderOption?: (option: string) => ReactElement;
}

export const ComboboxSingle = ({
  name,
  label,
  options,
  value,
  onChange,
  reset,
  placeholder,
  renderOption = (option) => <TextOption text={option} />,
}: ComboboxSingleProps) => {
  const [query, setQuery] = useState("");

  const showResetButton = !!value;

  const filteredOptions =
    query === ""
      ? options
      : options.filter((o) => {
          return o.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <HuiCombobox as="div" value={value} onChange={onChange} name={name} nullable>
      <HuiCombobox.Label className={clsx(labelStyles)}>{label}</HuiCombobox.Label>

      <div className="relative mt-1">
        <HuiCombobox.Input
          className={clsx([
            inputStyles,
            "relative border bg-white py-2 pl-3 focus:outline-hidden focus:ring-1 dark:bg-gray-900 dark:focus:ring-orange-400",
            showResetButton ? "pr-16" : "pr-10",
          ])}
          onChange={(event) => {
            onChange(event.target.value);
            setQuery(event.target.value);
          }}
          autoComplete="off"
          placeholder={placeholder}
        />

        {showResetButton && (
          <button
            onClick={reset}
            type="button"
              className={clsx([comboboxButtonStyles, "right-6"])}
            tabIndex={-1}
          >
            <XMarkIcon className={clsx(comboboxButtonIconStyles)} />
          </button>
        )}

        <ComboboxButton />

        {filteredOptions.length > 0 && (
          <ComboboxOptions>
            {filteredOptions.map((o) => (
              <ComboboxOption key={o} option={o} renderOption={renderOption} />
            ))}
          </ComboboxOptions>
        )}
      </div>
    </HuiCombobox>
  );
};
