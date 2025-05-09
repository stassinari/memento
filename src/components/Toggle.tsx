import { Switch } from "@headlessui/react";
import clsx from "clsx";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  colour?: "main" | "accent";
  label?: string;
  disabled?: boolean;
}

export const Toggle = ({
  checked,
  onChange,
  colour = "main",
  disabled = false,
  label,
}: ToggleProps) => (
  <Switch.Group as="div" className="flex items-center">
    <Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={clsx([
        "group relative inline-flex shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11",
        "disabled:bg-gray-100 disabled:cursor-not-allowed",
        "focus:outline-hidden focus:ring-2 focus:ring-offset-2",
        colour === "main"
          ? "focus:ring-orange-500"
          : colour === "accent"
            ? "focus:ring-blue-500"
            : null,
        checked
          ? colour === "main"
            ? "bg-orange-600"
            : colour === "accent"
              ? "bg-blue-600"
              : null
          : "bg-gray-200",
      ])}
    >
      <span
        aria-hidden="true"
        className={clsx([
          "inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow-sm pointer-events-none ring-0 group-disabled:bg-gray-50",
          checked ? "translate-x-5" : "translate-x-0",
        ])}
      />
    </Switch>
    {label && (
      <Switch.Label as="span" className="ml-3">
        <span
          className={clsx([
            "text-sm font-medium text-gray-700",
            disabled && "text-gray-400",
          ])}
        >
          {label}
        </span>
        {/* <span className="text-sm text-gray-500">(Save 10%)</span> */}
      </Switch.Label>
    )}
  </Switch.Group>
);
