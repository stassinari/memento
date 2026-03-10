import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import {
  pickerAnchoredMenuStyles,
  pickerOptionBaseStyles,
  pickerOptionCheckStyles,
  pickerRightIconButtonStyles,
  pickerRightIconStyles,
} from "./Combobox/sharedStyles";
import { inputStyles } from "./Input";

export interface SelectOption {
  value: string;
  label: string;
  secondaryText?: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  id?: string;
  value: string | null | undefined;
  onChange: (nextValue: string | null) => void;
  options?: SelectOption[];
  groups?: SelectOptionGroup[];
  emptyOptionLabel?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
}

const flattenOptions = (
  options: SelectOption[] | undefined,
  groups: SelectOptionGroup[] | undefined,
): SelectOption[] => {
  if (groups && groups.length > 0) {
    return groups.flatMap((group) => group.options);
  }

  return options ?? [];
};

const SelectMenuOption = ({
  option,
  inGroup = false,
}: {
  option: SelectOption;
  inGroup?: boolean;
}) => (
  <ListboxOption
    value={option.value}
    disabled={option.disabled}
    className={clsx(
      pickerOptionBaseStyles,
      "data-disabled:cursor-not-allowed data-disabled:opacity-50",
      inGroup ? "pl-6" : "pl-3",
    )}
  >
    <div className="flex min-w-0 gap-2">
      <span className="truncate font-normal group-data-selected:font-semibold">{option.label}</span>
      {option.secondaryText && (
        <span className="truncate text-gray-500 group-data-focus:text-orange-100 dark:text-gray-400 dark:group-data-focus:text-orange-100">
          {option.secondaryText}
        </span>
      )}
    </div>
    <span className={pickerOptionCheckStyles}>
      <CheckIcon aria-hidden="true" className="size-5" />
    </span>
  </ListboxOption>
);

export const Select = ({
  id,
  value,
  onChange,
  options,
  groups,
  emptyOptionLabel,
  clearable = false,
  disabled = false,
  className,
}: SelectProps) => {
  const allOptions = flattenOptions(options, groups);
  const selectedOption = allOptions.find((option) => option.value === value) ?? null;
  const hasGroups = Boolean(groups && groups.length > 0);
  const showClearButton = clearable && selectedOption && !disabled;

  return (
    <Listbox value={selectedOption?.value ?? null} onChange={onChange} disabled={disabled}>
      <div className={clsx("relative group", className)}>
        <ListboxButton
          id={id}
          className={clsx(
            inputStyles,
            "relative border bg-white py-2 pl-3 text-left focus:outline-hidden focus:ring-1 dark:bg-gray-900 dark:focus:ring-orange-400 group",
            showClearButton ? "pr-16" : "pr-10",
          )}
        >
          {selectedOption ? (
            <span className="flex min-w-0 gap-2">
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.secondaryText && (
                <span className="truncate text-gray-500 dark:text-gray-400">
                  {selectedOption.secondaryText}
                </span>
              )}
            </span>
          ) : (
            <span className="block truncate text-gray-400 dark:text-gray-500">
              {emptyOptionLabel ?? "Select"}
            </span>
          )}
        </ListboxButton>

        {showClearButton && (
          <button
            type="button"
            className={clsx(pickerRightIconButtonStyles, "right-6")}
            aria-label="Clear selection"
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onChange(null);
            }}
          >
            <XMarkIcon className={pickerRightIconStyles} />
          </button>
        )}

        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <ChevronUpDownIcon
            aria-hidden="true"
            className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
          />
        </span>

        <ListboxOptions
          anchor="bottom start"
          portal
          modal={false}
          transition
          style={{ maxHeight: "14rem" }}
          className={pickerAnchoredMenuStyles}
        >
          {hasGroups
            ? groups!.map((group) => (
                <div key={group.label} className="py-1">
                  <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>{group.label}</span>
                      <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                    </div>
                  </div>
                  {group.options.map((option) => (
                    <SelectMenuOption key={option.value} option={option} inGroup />
                  ))}
                </div>
              ))
            : allOptions.map((option) => <SelectMenuOption key={option.value} option={option} />)}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};
