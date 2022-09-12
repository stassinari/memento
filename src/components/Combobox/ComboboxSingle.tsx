import { Combobox as HuiCombobox } from "@headlessui/react";
import React, { ReactElement, useState } from "react";
import "twin.macro";
import { labelStyles } from "../Input";
import { TextOption } from "../ListOption";
import {
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "./ComboboxElements";

export interface ComboboxSingleProps {
  name: string;
  label: string;
  options: string[];
  value: any;
  onChange: (...event: any[]) => void;
  placeholder?: string;
  renderOption?: (option: string) => ReactElement;
}

export const ComboboxSingle: React.FC<ComboboxSingleProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  placeholder,
  renderOption = (option) => <TextOption text={option} />,
}) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((o) => {
          return o.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <HuiCombobox as="div" value={value} onChange={onChange} name={name}>
      <HuiCombobox.Label css={labelStyles}>{label}</HuiCombobox.Label>

      <div tw="relative mt-1">
        <ComboboxInput
          handleChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
        />

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
