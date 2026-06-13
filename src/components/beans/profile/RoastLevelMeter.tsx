import clsx from "clsx";
import { ROAST_LEVELS } from "~/lib/beans";

/**
 * 5-segment roast meter. Segments 0..level are "filled" (level 2 → 3 filled),
 * with the fill ramping orange-200 → orange-600 across the filled portion;
 * empty segments are gray. Always paired with the named label by the caller so
 * "level 3 of what?" is never ambiguous.
 */

const ORANGE_FILL: Record<number, string> = {
  200: "bg-orange-200",
  300: "bg-orange-300",
  400: "bg-orange-400",
  500: "bg-orange-500",
  600: "bg-orange-600",
};
const SHADES = [200, 300, 400, 500, 600] as const;

/** Pick the nearest available orange shade for ramp position `t` in [0, 1]. */
function fillClass(t: number): string {
  const target = 200 + t * 400;
  const shade = SHADES.reduce((a, b) =>
    Math.abs(b - target) < Math.abs(a - target) ? b : a,
  );
  return ORANGE_FILL[shade];
}

interface RoastLevelMeterProps {
  level: number; // 0..ROAST_LEVELS.length - 1
  className?: string;
}

export const RoastLevelMeter = ({ level, className }: RoastLevelMeterProps) => {
  const filledCount = level + 1;

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <span className="w-9 shrink-0 text-[10px] text-gray-400 dark:text-gray-500">
        {ROAST_LEVELS[0]}
      </span>
      <div className="flex flex-1 gap-1.5">
        {ROAST_LEVELS.map((_, i) => {
          const filled = i <= level;
          const t = filledCount > 1 ? i / (filledCount - 1) : 1;
          return (
            <div
              key={i}
              className={clsx(
                "h-2 flex-1 rounded-full",
                filled ? fillClass(t) : "bg-gray-200 dark:bg-white/10",
              )}
            />
          );
        })}
      </div>
      <span className="w-8 shrink-0 text-right text-[10px] text-gray-400 dark:text-gray-500">
        {ROAST_LEVELS[ROAST_LEVELS.length - 1]}
      </span>
    </div>
  );
};
