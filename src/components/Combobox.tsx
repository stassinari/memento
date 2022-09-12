import { Combobox as HuiCombobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import "twin.macro";
import { labelStyles } from "./Input";

interface Option {
  value: any;
  label: string;
}

const emptyState = { value: 0, label: "" };

interface ComboboxProps {
  name: string;
  label: string;
  options: Option[];
}

export const Combobox: React.FC<ComboboxProps> = ({ name, label, options }) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((o) => {
          return o.label.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <HuiCombobox as="div" defaultValue={emptyState} name={name}>
      <HuiCombobox.Label css={labelStyles}>{label}</HuiCombobox.Label>

      <div tw="relative mt-1">
        <HuiCombobox.Input
          tw="w-full py-2 pl-3 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: Option) => option.label}
        />
        <HuiCombobox.Button tw="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
          <ChevronUpDownIcon tw="w-5 h-5 text-gray-400" aria-hidden="true" />
        </HuiCombobox.Button>

        {filteredOptions.length > 0 && (
          <HuiCombobox.Options tw="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((o) => (
              <HuiCombobox.Option
                key={o.value}
                value={o}
                className="ui-active:bg-orange-600 ui-active:text-white ui-not-active:text-gray-900"
                tw="relative py-2 pl-3 cursor-default select-none pr-9 "
              >
                {({ selected }) => (
                  <React.Fragment>
                    <span
                      className="ui-selected:font-semibold"
                      tw="block truncate"
                    >
                      {o.label}
                    </span>

                    {selected && (
                      <span
                        className="ui-active:text-white ui-not-active:text-orange-600"
                        tw="absolute inset-y-0 right-0 flex items-center pr-4 "
                      >
                        <CheckIcon tw="w-5 h-5" aria-hidden="true" />
                      </span>
                    )}
                  </React.Fragment>
                )}
              </HuiCombobox.Option>
            ))}
          </HuiCombobox.Options>
        )}
      </div>
    </HuiCombobox>
  );
};
