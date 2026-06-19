import clsx from "clsx";
import { ROAST_LEVELS } from "~/lib/beans";

/**
 * 5-segment roast meter. Each position has a *fixed* shade (light → dark) and is
 * shown in that shade when filled (index ≤ level), else gray — a position's
 * colour never changes with the level. Always paired with the named label by
 * the caller so "level 3 of what?" is never ambiguous.
 */

// One fixed shade per position; index aligns with ROAST_LEVELS (Light → Dark).
const POSITION_FILL = [
  "bg-orange-200",
  "bg-orange-300",
  "bg-orange-400",
  "bg-orange-500",
  "bg-orange-600",
];

interface RoastLevelMeterProps {
  level: number; // 0..ROAST_LEVELS.length - 1
  className?: string;
  /** Light…Dark edge labels (profile card). Off → just the bar, for dense
   *  rows/cells where the named level is shown alongside by the caller. */
  showEdgeLabels?: boolean;
}

export const RoastLevelMeter = ({
  level,
  className,
  showEdgeLabels = true,
}: RoastLevelMeterProps) => (
  <div className={clsx("flex items-center gap-2", className)}>
    {showEdgeLabels && (
      <span className="w-9 shrink-0 text-[10px] text-gray-400 dark:text-gray-500">
        {ROAST_LEVELS[0]}
      </span>
    )}
    <div className="flex flex-1 gap-1.5">
      {ROAST_LEVELS.map((_, i) => (
        <div
          key={i}
          className={clsx(
            "h-2 flex-1 rounded-full",
            i <= level ? POSITION_FILL[i] : "bg-gray-200 dark:bg-white/10",
          )}
        />
      ))}
    </div>
    {showEdgeLabels && (
      <span className="w-8 shrink-0 text-right text-[10px] text-gray-400 dark:text-gray-500">
        {ROAST_LEVELS[ROAST_LEVELS.length - 1]}
      </span>
    )}
  </div>
);
