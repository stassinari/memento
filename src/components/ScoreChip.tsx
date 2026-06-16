import clsx from "clsx";
import { ReactNode } from "react";

interface ScoreChipProps {
  children: ReactNode;
  className?: string;
}

/**
 * Rectangular orange-on-orange score chip for drink ratings & tasting scores.
 * Deliberately squared (not a pill) so it reads differently from `Badge`.
 */
export const ScoreChip = ({ children, className }: ScoreChipProps) => (
  <span
    className={clsx(
      "inline-flex items-center justify-center rounded-sm bg-orange-50 px-1 py-0.5 text-sm font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
      className,
    )}
  >
    {children}
  </span>
);
