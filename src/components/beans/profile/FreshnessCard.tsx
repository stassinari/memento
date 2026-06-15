import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import {
  Archive,
  CircleHelp,
  Flame,
  type LucideIcon,
  PlusCircleIcon,
  Snowflake,
  WavesVertical,
} from "lucide-react";
import { useState } from "react";
import { BigStat } from "~/components/BigStat";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Beans } from "~/db/types";
import { daysBetween, formatAge, getBeanActions, getFreshness, startOfToday } from "~/lib/beans";
import { fmtStorageDate } from "./format";
import { FreshnessDurationBar } from "./FreshnessDurationBar";
import { FreshnessInfoDialog } from "./FreshnessInfoDialog";
import { ProfileCardHeader } from "./ProfileCardHeader";

interface FreshnessCardProps {
  bean: Beans;
  beansId: string;
  /** Mobile owns the Freeze/Thaw actions inside this card; desktop puts them in the toolbar. */
  showActions: boolean;
  onFreeze: () => void;
  onThaw: () => void;
}

export const FreshnessCard = ({
  bean,
  beansId,
  showActions,
  onFreeze,
  onThaw,
}: FreshnessCardProps) => {
  const today = startOfToday();
  const freshness = getFreshness(bean, today);
  // Shared hover key links a bar segment to its timeline row (both directions).
  const [hovered, setHovered] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // Action availability is centralized (archived beans never expose freeze/thaw).
  const actions = getBeanActions(bean);

  // Freeze ghost (header) and the big Thaw button — mobile only. Computed up here
  // so they're available in the no-roast prompt too.
  const freezeButton =
    actions.canFreeze && showActions ? (
      <Button variant="white" size="xs" onClick={onFreeze}>
        <Snowflake /> Freeze
      </Button>
    ) : undefined;

  const thawButton =
    actions.canThaw && showActions ? (
      <Button
        variant="secondary"
        colour="accent"
        width="full"
        size="lg"
        onClick={onThaw}
        className="mt-5"
      >
        <Snowflake /> Thaw beans
      </Button>
    ) : null;

  // ---- No roast date → quiet prompt (still allows freeze/thaw) -----------
  if (!freshness.hasRoastDate) {
    return (
      <Card.Container className="overflow-hidden">
        <ProfileCardHeader title="Freshness" muted right={freezeButton} />
        <Card.Content className="py-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No roast date recorded</p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Add one to track effective age
          </p>
          <div className="mt-3 flex justify-center">
            <Button variant="white" size="sm" asChild>
              <Link to="/beans/$beansId/edit" params={{ beansId }}>
                <PlusCircleIcon />
                Add roast date
              </Link>
            </Button>
          </div>
          {thawButton}
        </Card.Content>
      </Card.Container>
    );
  }

  const { state, isArchived, effectiveDays } = freshness;

  const age = formatAge(effectiveDays ?? 0);
  const subLabel = isArchived
    ? `effective ${age.unit} at archive`
    : state === "open"
      ? `${age.unit} old`
      : `effective ${age.unit} old`;

  return (
    <Card.Container className="overflow-hidden">
      <ProfileCardHeader
        title="Freshness"
        muted={isArchived}
        titleAdornment={
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            aria-label="How freshness works"
            className="inline-flex items-center justify-center rounded-full text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <CircleHelp className="size-4" />
          </button>
        }
        right={freezeButton}
      />
      <FreshnessInfoDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
      <Card.Content>
        <BigStat
          value={age.value}
          subtitle={subLabel}
          valueClassName={isArchived ? "text-gray-500 dark:text-gray-400" : undefined}
        />

        <FreshnessDurationBar
          freshness={freshness}
          hovered={hovered}
          onHover={setHovered}
          className="mt-4"
        />

        {/* Timeline is always visible now (≤ 4 rows) — no disclosure. */}
        <div className="mt-5 border-t border-gray-100 pt-4 dark:border-white/10">
          <FreshnessTimeline
            freshness={freshness}
            today={today}
            hovered={hovered}
            onHover={setHovered}
          />
        </div>

        {/* Contextual action (mobile only): Thaw sits at the bottom of the card. */}
        {thawButton}
      </Card.Content>
    </Card.Container>
  );
};

interface FreshnessTimelineProps {
  freshness: ReturnType<typeof getFreshness>;
  today: Date;
  hovered: string | null;
  onHover: (key: string | null) => void;
}

type Tone = "orange" | "blue" | "gray";

interface TimelineEvent {
  key: string;
  Icon: LucideIcon;
  tone: Tone;
  label: string;
  date: string | null;
  detail: string | null;
}

// Idle vs hovered styling for the icon badge — hovering lights it up in its
// phase colour (and the same key swells the matching bar segment).
const TONES: Record<Tone, { idle: string; active: string; idleIcon: string; activeIcon: string }> =
  {
    orange: {
      idle: "bg-white ring-1 ring-orange-200 dark:bg-gray-900 dark:ring-orange-400/30",
      active:
        "scale-110 bg-orange-100 ring-2 ring-orange-400 dark:bg-orange-500/20 dark:ring-orange-400/60",
      idleIcon: "text-orange-500 dark:text-orange-400",
      activeIcon: "text-orange-600 dark:text-orange-300",
    },
    blue: {
      idle: "bg-white ring-1 ring-blue-200 dark:bg-gray-900 dark:ring-blue-400/30",
      active:
        "scale-110 bg-blue-100 ring-2 ring-blue-400 dark:bg-blue-500/20 dark:ring-blue-400/60",
      idleIcon: "text-blue-500 dark:text-blue-300",
      activeIcon: "text-blue-600 dark:text-blue-200",
    },
    gray: {
      idle: "bg-white ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-white/15",
      active: "scale-110 bg-gray-100 ring-2 ring-gray-400 dark:bg-white/15 dark:ring-white/30",
      idleIcon: "text-gray-500 dark:text-gray-400",
      activeIcon: "text-gray-700 dark:text-gray-200",
    },
  };

const ageLabel = (days: number) => {
  const { value, unit } = formatAge(days);
  return `${value} ${unit}`;
};
const agoLabel = (days: number) => (days <= 0 ? "today" : `${ageLabel(days)} ago`);

/** A subtle vertical feed of lifecycle events, one icon per action. */
const FreshnessTimeline = ({ freshness, today, hovered, onHover }: FreshnessTimelineProps) => {
  const { roastDate, freezeDate, thawDate, archiveDate, isArchived, endDate } = freshness;

  const events: TimelineEvent[] = [];
  if (roastDate)
    events.push({
      key: "roasted",
      Icon: Flame,
      tone: "orange",
      label: "Roasted",
      date: fmtStorageDate(roastDate),
      detail: agoLabel(daysBetween(roastDate, today)),
    });
  if (freezeDate)
    events.push({
      key: "frozen",
      Icon: Snowflake,
      tone: "blue",
      label: "Frozen",
      date: fmtStorageDate(freezeDate),
      detail: `for ${ageLabel(daysBetween(freezeDate, thawDate ?? endDate))}`,
    });
  if (thawDate)
    events.push({
      key: "thawed",
      Icon: WavesVertical,
      tone: "orange",
      label: "Thawed",
      date: fmtStorageDate(thawDate),
      detail: agoLabel(daysBetween(thawDate, today)),
    });
  if (isArchived && archiveDate)
    events.push({
      key: "archived",
      Icon: Archive,
      tone: "gray",
      label: "Archived",
      date: fmtStorageDate(archiveDate),
      detail: agoLabel(daysBetween(archiveDate, today)),
    });

  return (
    <ul role="list">
      {events.map((event, i) => {
        const active = hovered === event.key;
        return (
          <li
            key={event.key}
            className="relative flex gap-x-3 pb-4 last:pb-0"
            onMouseEnter={() => onHover(event.key)}
            onMouseLeave={() => onHover(null)}
          >
            {/* connecting line behind the icons */}
            <div
              className={clsx(
                i === events.length - 1 ? "h-6" : "-bottom-4",
                "absolute left-0 top-0 flex w-6 justify-center",
              )}
            >
              <div className="w-px bg-gray-200 dark:bg-white/15" />
            </div>
            <div
              className={clsx(
                "relative flex size-6 flex-none items-center justify-center rounded-full transition-all duration-150",
                active ? TONES[event.tone].active : TONES[event.tone].idle,
              )}
            >
              <event.Icon
                className={clsx(
                  "size-3.5 transition-colors",
                  active ? TONES[event.tone].activeIcon : TONES[event.tone].idleIcon,
                )}
              />
            </div>
            <div className="flex flex-auto items-center justify-between gap-2 py-0.5 text-sm">
              <span>
                <span
                  className={clsx(
                    "font-semibold transition-colors",
                    active ? "text-gray-950 dark:text-white" : "text-gray-800 dark:text-gray-200",
                  )}
                >
                  {event.label}
                </span>
                {event.date && (
                  <span className="text-gray-400 dark:text-gray-500"> · {event.date}</span>
                )}
              </span>
              {event.detail && (
                <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                  {event.detail}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
