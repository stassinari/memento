import { Combobox as HuiCombobox } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { ReactElement, useState } from "react";
import tw from "twin.macro";
import { inputStyles, labelStyles } from "../Input";
import { TextOption } from "../ListOption";
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
  reset: VoidFunction;
  placeholder?: string;
  renderOption?: (option: string) => ReactElement;
}

export const ComboboxSingle: React.FC<ComboboxSingleProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  reset,
  placeholder,
  renderOption = (option) => <TextOption text={option} />,
}) => {
  const [query, setQuery] = useState("");

  const showResetButton = !!value;

  const filteredOptions =
    query === ""
      ? options
      : options.filter((o) => {
          return o.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <HuiCombobox
      as="div"
      value={value}
      onChange={onChange}
      name={name}
      nullable
    >
      <HuiCombobox.Label css={labelStyles}>{label}</HuiCombobox.Label>

      <div tw="relative mt-1">
        <HuiCombobox.Input
          css={[
            inputStyles,
            tw`relative py-2 pl-3 bg-white border focus:(outline-none ring-1)`,
            showResetButton ? tw`pr-16` : tw`pr-10`,
          ]}
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
            css={[comboboxButtonStyles, tw`right-6`]}
            tabIndex={-1}
          >
            <XMarkIcon css={comboboxButtonIconStyles} />
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
