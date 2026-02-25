import { Label, Radio, RadioGroup } from "@headlessui/react";
import { ComputerDesktopIcon, MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useTheme } from "~/hooks/useTheme";
import { ThemePreference } from "~/theme/theme";

const options: Array<{ label: string; value: ThemePreference; icon?: React.ElementType }> = [
  { label: "Light", value: "light", icon: SunIcon },
  { label: "System", value: "system", icon: ComputerDesktopIcon },
  { label: "Dark", value: "dark", icon: MoonIcon },
];

interface ThemePickerProps {
  className?: string;
  label?: string;
}

export const ThemePicker = ({ className, label = "Theme" }: ThemePickerProps) => {
  const { preference, setPreference } = useTheme();

  return (
    <div className={clsx("space-y-2", className)}>
      <p className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <RadioGroup value={preference} onChange={setPreference}>
        <Label className="sr-only">{label}</Label>
        <div className="isolate inline-flex w-full rounded-md shadow-xs dark:shadow-none">
          {options.map((option, index) => (
            <Radio
              key={option.value}
              value={option.value}
              aria-label={option.label}
              className={clsx([
                "relative inline-flex flex-1 items-center justify-center px-3 py-2 text-sm font-semibold transition focus:z-10 focus:outline-hidden",
                "inset-ring-1 inset-ring-gray-300 dark:inset-ring-gray-700",
                "ui-checked:bg-orange-600 ui-checked:text-white hover:ui-checked:bg-orange-700 dark:ui-checked:bg-orange-500 dark:hover:ui-checked:bg-orange-400",
                "ui-not-checked:bg-white ui-not-checked:text-gray-700 hover:ui-not-checked:bg-gray-50 dark:ui-not-checked:bg-white/10 dark:ui-not-checked:text-gray-200 dark:hover:ui-not-checked:bg-white/20",
                "ui-active:ring-2 ui-active:ring-orange-500 ui-active:ring-offset-2 ui-active:ring-offset-white dark:ui-active:ring-orange-400 dark:ui-active:ring-offset-gray-900",
                index === 0 && "rounded-l-md",
                index === options.length - 1 && "rounded-r-md",
                index !== 0 && "-ml-px",
              ])}
            >
              {option.icon && (
                <>
                  <option.icon className="h-4 w-4 md:mr-0 mr-2" />
                  <span className="md:sr-only">{option.label}</span>
                </>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
