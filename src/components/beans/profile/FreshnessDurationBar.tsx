import clsx from "clsx";
import { daysBetween, Freshness } from "~/lib/beans";

/**
 * "Battery"-style duration bar — flex-weighted segments in a track, NOT a slider
 * (no handles). Orange = actively aging, blue = frozen (paused), gray = archived
 * (closed). Weights are proportions of the calendar timeline.
 */

type SegmentColor = "orange" | "blue" | "gray";

const SEGMENT_STYLES: Record<SegmentColor, string> = {
  orange: "bg-orange-400",
  blue: "bg-blue-300 dark:bg-blue-400/70",
  gray: "bg-gray-300 dark:bg-white/15",
};

interface Segment {
  weight: number;
  color: SegmentColor;
}

function getSegments(freshness: Freshness): Segment[] {
  const { state, isArchived, roastDate, freezeDate, thawDate, endDate } = freshness;
  if (!roastDate) return [];

  // Archived → one muted bar (closed state), regardless of the underlying split.
  if (isArchived) return [{ weight: 1, color: "gray" }];

  if (state === "frozen" && freezeDate) {
    return [
      { weight: daysBetween(roastDate, freezeDate), color: "orange" },
      { weight: daysBetween(freezeDate, endDate), color: "blue" },
    ];
  }
  if (state === "thawed" && freezeDate && thawDate) {
    return [
      { weight: daysBetween(roastDate, freezeDate), color: "orange" },
      { weight: daysBetween(freezeDate, thawDate), color: "blue" },
      { weight: daysBetween(thawDate, endDate), color: "orange" },
    ];
  }
  // open
  return [{ weight: daysBetween(roastDate, endDate), color: "orange" }];
}

interface FreshnessDurationBarProps {
  freshness: Freshness;
  className?: string;
}

export const FreshnessDurationBar = ({ freshness, className }: FreshnessDurationBarProps) => {
  const segments = getSegments(freshness);
  if (segments.length === 0) return null;

  // Guard against an all-zero timeline (same-day) so something still renders.
  const hasWeight = segments.some((s) => s.weight > 0);

  return (
    <div
      className={clsx(
        "flex h-4 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-white/10",
        className,
      )}
    >
      {segments.map((segment, i) => (
        <div
          key={i}
          className={clsx("rounded-sm", SEGMENT_STYLES[segment.color])}
          style={{ flex: hasWeight ? segment.weight : i === 0 ? 1 : 0 }}
        />
      ))}
    </div>
  );
};
