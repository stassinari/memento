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

export interface ComboboxMultiProps {
  name: string;
  label: string;
  options: string[];
  values: any[];
  onChange: (...event: any[]) => void;
  renderOption?: (option: string) => ReactElement;
}

export const ComboboxMulti: React.FC<ComboboxMultiProps> = ({
  name,
  label,
  options,
  values,
  onChange,
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
    <HuiCombobox
      as="div"
      value={[...values]}
      onChange={onChange}
      name={name}
      multiple
    >
      <HuiCombobox.Label css={labelStyles}>{label}</HuiCombobox.Label>

      <div tw="relative mt-1">
        <ComboboxInput
          handleChange={(event) => setQuery(event.target.value)}
          displayValue={() => ""}
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
      {values.length > 0 && (
        <ul tw="flex gap-2">
          {values.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      )}
    </HuiCombobox>
  );
};
