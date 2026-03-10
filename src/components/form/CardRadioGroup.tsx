import { CheckCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import type { ReactNode } from "react";

export interface CardRadioOption<T extends string> {
  value: T;
  title: string;
  description?: string;
  content?: ReactNode;
  disabled?: boolean;
}

interface CardRadioGroupProps<T extends string> {
  legend: ReactNode;
  value: T | null;
  onChange: (nextValue: T) => void;
  options: CardRadioOption<T>[];
  disabled?: boolean;
}

export const CardRadioGroup = <T extends string>({
  legend,
  value,
  onChange,
  options,
  disabled = false,
}: CardRadioGroupProps<T>) => (
  <fieldset>
    <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">{legend}</legend>
    {/* TODO this currently only work for 2 columns, expand when needed */}
    <div className="mt-3 grid gap-4 sm:grid-cols-2">
      {options.map((option) => {
        const optionDisabled = disabled || option.disabled;
        const isChecked = value === option.value;

        return (
          <label
            key={option.value}
            className={clsx(
              "group relative flex rounded-lg border border-gray-300 bg-white p-4 has-focus-visible:outline-3 has-focus-visible:-outline-offset-1 dark:border-white/10 dark:bg-gray-900",
              isChecked && "-outline-offset-2 outline-2 outline-orange-600 dark:outline-orange-400",
              optionDisabled && "cursor-not-allowed opacity-80",
            )}
          >
            <input
              type="radio"
              className="sr-only"
              checked={isChecked}
              disabled={optionDisabled}
              onChange={() => onChange(option.value)}
            />

            <div className="flex-1">
              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                {option.title}
              </span>
              {option.description && (
                <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </span>
              )}
              {option.content && <div className="mt-3">{option.content}</div>}
            </div>

            <CheckCircleIcon
              className={clsx(
                "size-5 text-orange-600 dark:text-orange-400",
                isChecked ? "visible" : "invisible",
              )}
            />
          </label>
        );
      })}
    </div>
  </fieldset>
);
