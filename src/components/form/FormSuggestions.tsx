import clsx from "clsx";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { Badge, BadgeCheckIcon, BadgePlusIcon } from "../Badge";

interface Suggestion {
  label: string;
  onClick: () => void;
  /** When the field already holds this value, render the chip as selected. */
  active?: boolean;
}
interface FormSuggestionsProps {
  suggestions?: Suggestion[];
}

export function extractSuggestions<T>(arr: T[], field: keyof T, limit = 3) {
  return [...new Set(arr.map((b) => b[field]).filter((f) => !!f))].slice(0, limit) as string[];
}

/**
 * Leading chip icon that crossfades from "+" to a tick when the suggestion is
 * the field's current value. Both icons are stacked so the swap animates in
 * place rather than shifting the chip's width.
 */
const SuggestionIcon = ({ active }: { active: boolean }) => (
  <span className="relative block h-full w-full">
    <BadgePlusIcon
      className={clsx(
        "absolute inset-0 h-full w-full transition-all duration-200",
        active ? "scale-0 opacity-0" : "scale-100 opacity-100",
      )}
    />
    <BadgeCheckIcon
      className={clsx(
        "absolute inset-0 h-full w-full transition-all duration-200",
        active ? "scale-100 opacity-100" : "scale-0 opacity-0",
      )}
    />
  </span>
);

export const FormSuggestions = ({ suggestions }: FormSuggestionsProps) => {
  const isSm = useScreenMediaQuery("sm");
  if (suggestions?.length === 0) return null;
  return (
    <div className="mt-2 flex items-baseline text-xs text-gray-600 dark:text-gray-300">
      Recent:
      <ul className="ml-2 flex flex-wrap items-center gap-2">
        {suggestions?.map(({ label, onClick, active = false }) => (
          <li key={label}>
            <Badge
              label={label}
              colour={active ? "orange" : "grey"}
              size={isSm ? "small" : "large"}
              clickable={true}
              icon={{
                Element: <SuggestionIcon active={active} />,
                position: "left",
                onClick,
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
