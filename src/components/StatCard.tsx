import clsx from "clsx";
import { ReactNode } from "react";
import { Card } from "~/components/Card";

interface StatCardProps {
  /** Small uppercase label above the figure. */
  label: string;
  /** The headline figure (number or short node). */
  value: ReactNode;
  /** Optional muted line below the figure (e.g. "top: Square Mile (29)"). */
  meta?: ReactNode;
  /** Colour override for the figure (defaults to neutral). */
  valueClassName?: string;
  className?: string;
}

/**
 * A compact summary stat: label · big figure · optional meta line, in a flat
 * card. Used in the History summary strip; generic enough for future
 * brews/espresso summaries. Modelled on Tailwind Plus "stats in cards".
 */
export const StatCard = ({ label, value, meta, valueClassName, className }: StatCardProps) => (
  <Card.Container variant="flat" className={clsx("min-w-36 flex-1 px-4 py-3", className)}>
    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
      {label}
    </p>
    <p
      className={clsx(
        "mt-0.5 font-heading text-2xl font-bold leading-tight tracking-tight",
        valueClassName ?? "text-gray-900 dark:text-gray-100",
      )}
    >
      {value}
    </p>
    {meta != null && <p className="truncate text-xs text-gray-400 dark:text-gray-500">{meta}</p>}
  </Card.Container>
);
