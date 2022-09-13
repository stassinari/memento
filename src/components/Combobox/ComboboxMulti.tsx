import { Combobox as HuiCombobox } from "@headlessui/react";
import React, { ReactElement, useState } from "react";
import "twin.macro";
import tw from "twin.macro";
import { Badge } from "../Badge";
import { inputStyles, labelStyles } from "../Input";
import { TextOption } from "../ListOption";
import {
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "./ComboboxElements";

export interface ComboboxMultiProps {
  name: string;
  label: string;
  options: string[];
  values: any[];
  onChange: (...event: any[]) => void;
  removeItem: (item: any) => void;
  placeholder?: string;
  renderOption?: (option: string) => ReactElement;
}

export const ComboboxMulti: React.FC<ComboboxMultiProps> = ({
  name,
  label,
  options,
  values,
  onChange,
  removeItem,
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
    <HuiCombobox
      as="div"
      value={[...values]}
      onChange={onChange}
      name={name}
      multiple
    >
      <HuiCombobox.Label css={labelStyles}>{label}</HuiCombobox.Label>

      <div tw="relative mt-1">
        <div
          css={[
            inputStyles,
            tw`relative py-2 pl-3 pr-10 bg-white border focus:(outline-none ring-1)`,
          ]}
        >
          <div tw="min-h-[1.25rem]">
            <div tw="flex flex-wrap gap-2">
              {values.length > 0 &&
                values.map((v) => (
                  <Badge key={v} label={v} onClick={() => removeItem(v)} />
                ))}
              <HuiCombobox.Input
                type="text"
                placeholder={placeholder}
                tw="flex-grow text-sm border-none p-0 focus:(outline-none border-none border-transparent ring-0)"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
        </div>

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
