import clsx from "clsx";
import { Tooltip } from "~/components/Tooltip";
import { daysBetween, formatAge, Freshness } from "~/lib/beans";
import { fmtStorageDate } from "./format";

/**
 * "Battery"-style duration bar — flex-weighted segments in a track, NOT a slider
 * (no handles). Orange = actively aging, blue = frozen (paused), gray = archived
 * (closed). Each segment shows a tooltip on hover with its phase + dates.
 */

type SegmentColor = "orange" | "blue" | "gray";

const SEGMENT_STYLES: Record<SegmentColor, string> = {
  orange: "bg-orange-400",
  blue: "bg-blue-300 dark:bg-blue-400/70",
  gray: "bg-gray-300 dark:bg-white/15",
};

interface Segment {
  key: string;
  color: SegmentColor;
  weight: number;
  title: string;
  detail: string;
}

const ageLabel = (days: number) => {
  const { value, unit } = formatAge(days);
  return `${value} ${unit}`;
};

/** "7 days · 12 May → 19 May" (or "→ now"). */
const span = (from: Date, to: Date, toIsNow: boolean) =>
  `${ageLabel(daysBetween(from, to))} · ${fmtStorageDate(from, "D MMM")} → ${
    toIsNow ? "now" : fmtStorageDate(to, "D MMM")
  }`;

function getSegments(freshness: Freshness): Segment[] {
  const { state, isArchived, roastDate, freezeDate, thawDate, endDate } = freshness;
  if (!roastDate) return [];

  // Archived shows the same phase history, but capped at the archive date (not
  // "now") and rendered muted by the component to read as "closed".
  const endIsNow = !isArchived;

  if (state === "frozen" && freezeDate) {
    return [
      {
        key: "aging",
        color: "orange",
        weight: daysBetween(roastDate, freezeDate),
        title: "Aging",
        detail: span(roastDate, freezeDate, false),
      },
      {
        key: "frozen",
        color: "blue",
        weight: daysBetween(freezeDate, endDate),
        title: "Frozen",
        detail: span(freezeDate, endDate, endIsNow),
      },
    ];
  }
  if (state === "thawed" && freezeDate && thawDate) {
    return [
      {
        key: "aging1",
        color: "orange",
        weight: daysBetween(roastDate, freezeDate),
        title: "Aging",
        detail: span(roastDate, freezeDate, false),
      },
      {
        key: "frozen",
        color: "blue",
        weight: daysBetween(freezeDate, thawDate),
        title: "Frozen",
        detail: span(freezeDate, thawDate, false),
      },
      {
        key: "aging2",
        color: "orange",
        weight: daysBetween(thawDate, endDate),
        title: "Aging",
        detail: span(thawDate, endDate, endIsNow),
      },
    ];
  }
  // open
  return [
    {
      key: "aging",
      color: "orange",
      weight: daysBetween(roastDate, endDate),
      title: "Aging",
      detail: span(roastDate, endDate, endIsNow),
    },
  ];
}

/** Which timeline event a segment corresponds to (the event that begins it). */
const linkKeyFor = (segmentKey: string): string => {
  if (segmentKey === "frozen") return "frozen";
  if (segmentKey === "aging2") return "thawed";
  return "roasted"; // aging / aging1 begin at roast
};

interface FreshnessDurationBarProps {
  freshness: Freshness;
  /** Shared hover key (links a segment to its timeline row). Optional standalone. */
  hovered?: string | null;
  onHover?: (key: string | null) => void;
  className?: string;
}

export const FreshnessDurationBar = ({
  freshness,
  hovered,
  onHover,
  className,
}: FreshnessDurationBarProps) => {
  const segments = getSegments(freshness);
  if (segments.length === 0) return null;

  // Guard against an all-zero timeline (same-day) so something still renders.
  const hasWeight = segments.some((s) => s.weight > 0);

  return (
    <div
      className={clsx(
        "flex h-6 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-white/10",
        // Archived = history, not current freshness: fade + desaturate the phases.
        freshness.isArchived && "opacity-70 saturate-50",
        className,
      )}
    >
      {segments.map((segment, i) => {
        const linkKey = linkKeyFor(segment.key);
        const active = hovered === linkKey;
        return (
          <Tooltip
            key={segment.key}
            content={
              <>
                <span className="font-semibold">{segment.title}</span>
                <span className="block text-gray-300 dark:text-gray-300">{segment.detail}</span>
              </>
            }
          >
            <div
              onMouseEnter={() => onHover?.(linkKey)}
              onMouseLeave={() => onHover?.(null)}
              className={clsx(
                // CSS :hover handles direct hover; `active` mirrors a timeline-row hover.
                "origin-center cursor-default rounded-sm transition duration-150 hover:scale-y-125 hover:brightness-105",
                SEGMENT_STYLES[segment.color],
                active && "scale-y-125 brightness-105",
              )}
              style={{ flex: hasWeight ? segment.weight : i === 0 ? 1 : 0 }}
            />
          </Tooltip>
        );
      })}
    </div>
  );
};
