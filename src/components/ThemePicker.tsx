import clsx from "clsx";
import { useTheme } from "~/hooks/useTheme";
import { ThemePreference } from "~/theme/theme";

const options: Array<{ label: string; value: ThemePreference }> = [
  { label: "Light", value: "light" },
  { label: "System", value: "system" },
  { label: "Dark", value: "dark" },
];

interface ThemePickerProps {
  className?: string;
  label?: string;
}

export const ThemePicker = ({ className, label = "Theme" }: ThemePickerProps) => {
  const { preference, setPreference } = useTheme();

  return (
    <div className={clsx("space-y-2", className)}>
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {label}
      </p>

      <div className="inline-flex w-full rounded-md bg-white p-1 shadow-xs ring-1 ring-gray-300 dark:bg-gray-900 dark:ring-white/15">
        {options.map((option) => {
          const isActive = preference === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={clsx([
                "flex-1 rounded-sm px-2.5 py-1.5 text-xs font-medium transition",
                "focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-orange-400 dark:focus:ring-offset-gray-900",
                isActive
                  ? "bg-orange-600 text-white dark:bg-orange-500"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/10",
              ])}
              onClick={() => setPreference(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
