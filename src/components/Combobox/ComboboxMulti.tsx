import { Combobox as HuiCombobox } from "@headlessui/react";
import clsx from "clsx";
import React, { ReactElement, useRef, useState } from "react";
import { Badge, BadgeTimesIcon } from "../Badge";
import { inputStyles, labelStyles } from "../Input";
import { TextOption } from "../form/ListOption";
import { ComboboxButton, ComboboxOption, ComboboxOptions } from "./ComboboxElements";

export interface ComboboxMultiProps {
  name: string;
  label: string;
  options: string[];
  values?: any[];
  onChange: (...event: any[]) => void;
  removeItem: (item: any) => void;
  placeholder?: string;
  renderOption?: (option: string) => ReactElement;
}

export const ComboboxMulti = ({
  name,
  label,
  options,
  values = [],
  onChange,
  removeItem,
  placeholder,
  renderOption = (option) => <TextOption text={option} />,
}: ComboboxMultiProps) => {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLInputElement>(null);

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
      onChange={(newValues) => {
        onChange(newValues);
        setQuery("");
        ref.current?.focus();
      }}
      name={name}
      multiple
    >
      <HuiCombobox.Label className={clsx(labelStyles)}>{label}</HuiCombobox.Label>

      <div className="relative mt-1">
        <div
          className={clsx([
            inputStyles,
            "relative py-2 pl-3 pr-10 bg-white border focus:outline-hidden focus:ring-1",
          ])}
        >
          <div className="min-h-[1.25rem]">
            <div className="flex flex-wrap gap-2">
              {values.length > 0 &&
                values.map((v) => (
                  <Badge
                    key={v}
                    label={v}
                    colour="orange"
                    icon={{
                      Element: <BadgeTimesIcon />,
                      position: "right",
                      onClick: () => {
                        removeItem(v);
                      },
                    }}
                  />
                ))}
              <HuiCombobox.Input
                ref={ref}
                type="text"
                placeholder={placeholder}
                displayValue={() => query}
                className="grow text-sm border-none p-0 focus:outline-hidden focus:border-none focus:border-transparent focus:ring-0"
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <ComboboxButton />

        <ComboboxOptions>
          {query.length > 0 && (
            <ComboboxOption
              option={query}
              renderOption={(o) => <TextOption text={`Create "${o}"`} />}
            />
          )}
          {filteredOptions.map((o) => (
            <ComboboxOption key={o} option={o} renderOption={renderOption} />
          ))}
        </ComboboxOptions>
      </div>
    </HuiCombobox>
  );
};
