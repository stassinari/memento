import clsx from "clsx";
import { ReactNode } from "react";

interface ScoreChipProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Rectangular score chip for drink ratings & tasting scores — orange-on-orange
 * when there's a value, a matching muted "—" chip when there isn't, so empty
 * scores read consistently everywhere. Deliberately squared (not a pill) so it
 * reads differently from `Badge`.
 */
export const ScoreChip = ({ children, className }: ScoreChipProps) => {
  const empty = children == null || children === "";
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-sm px-1 py-0.5 text-sm font-medium",
        empty
          ? "bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-gray-500"
          : "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
        className,
      )}
    >
      {empty ? "—" : children}
    </span>
  );
};
