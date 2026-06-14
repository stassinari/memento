import clsx from "clsx";
import { ReactNode } from "react";

interface BigStatProps {
  /** The big figure — a number or short text. */
  value: ReactNode;
  /** The small subtitle beside it. */
  subtitle: ReactNode;
  /** Colour override for the figure (defaults to neutral gray). */
  valueClassName?: string;
  className?: string;
}

/**
 * A big figure with a small subtitle beside it — e.g. "8.4 avg · 12 drinks" or
 * "7 effective days old". The figure uses the heading font; the subtitle is a
 * muted, slightly-bold label.
 */
export const BigStat = ({ value, subtitle, valueClassName, className }: BigStatProps) => (
  <div className={clsx("flex items-baseline gap-2", className)}>
    <span
      className={clsx(
        "font-heading text-4xl font-bold leading-none tracking-tight",
        valueClassName ?? "text-gray-900 dark:text-gray-100",
      )}
    >
      {value}
    </span>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{subtitle}</span>
  </div>
);
