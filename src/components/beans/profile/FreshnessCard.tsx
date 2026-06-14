import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { ChevronDown, Snowflake } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Beans } from "~/db/types";
import { daysBetween, getFreshness, startOfToday } from "~/lib/beans";
import { fmtDaysAgo, fmtStorageDate } from "./format";
import { FreshnessDurationBar } from "./FreshnessDurationBar";
import { ProfileCardHeader } from "./ProfileCardHeader";

interface FreshnessCardProps {
  bean: Beans;
  beansId: string;
  /** Mobile owns the Freeze/Thaw actions inside this card; desktop puts them in the toolbar. */
  showActions: boolean;
  /** Desktop expands the timeline inline; mobile hides it behind a disclosure. */
  timelineExpanded: boolean;
  onFreeze: () => void;
  onThaw: () => void;
}

export const FreshnessCard = ({
  bean,
  beansId,
  showActions,
  timelineExpanded,
  onFreeze,
  onThaw,
}: FreshnessCardProps) => {
  const today = startOfToday();
  const freshness = getFreshness(bean, today);
  const [open, setOpen] = useState(false);

  // ---- No roast date → quiet prompt -------------------------------------
  if (!freshness.hasRoastDate) {
    return (
      <Card.Container className="overflow-hidden">
        <ProfileCardHeader title="Freshness" muted />
        <Card.Content className="py-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No roast date recorded</p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Add one to track effective age
          </p>
          <div className="mt-3 flex justify-center">
            <Button variant="white" size="sm" asChild>
              <Link to="/beans/$beansId/edit" params={{ beansId }}>
                + Add roast date
              </Link>
            </Button>
          </div>
        </Card.Content>
      </Card.Container>
    );
  }

  const { state, isArchived, effectiveDays, calendarDays, frozenDays } = freshness;

  // Header hint (right slot), state-dependent.
  const headerRight = isArchived ? (
    <span className="text-[11px] text-gray-400 dark:text-gray-500">end of the line</span>
  ) : state === "frozen" ? (
    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-300">clock paused</span>
  ) : state === "thawed" ? (
    <span className="text-[11px] text-gray-400 dark:text-gray-500">aging resumed</span>
  ) : showActions ? (
    <Button variant="white" size="xs" onClick={onFreeze}>
      <Snowflake /> Freeze
    </Button>
  ) : undefined;

  const subLabel = isArchived
    ? "effective days at archive"
    : state === "open"
      ? "days old"
      : "effective days old";

  return (
    <Card.Container className="overflow-hidden">
      <ProfileCardHeader title="Freshness" muted={isArchived} right={headerRight} />
      <Card.Content>
        <div className="flex items-baseline gap-2">
          <span
            className={clsx(
              "font-heading text-4xl font-bold leading-none tracking-tight",
              isArchived ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100",
            )}
          >
            {effectiveDays}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{subLabel}</span>
        </div>

        {!isArchived && state !== "open" && calendarDays !== null && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {calendarDays} days since roast · frozen for {frozenDays} of them
          </p>
        )}

        <FreshnessDurationBar freshness={freshness} className="mt-4" />

        {/* Caption row under the bar */}
        <BarCaptions
          state={state}
          isArchived={isArchived}
          frozenDays={frozenDays}
          effectiveDays={effectiveDays}
          roastLabel={fmtStorageDate(freshness.roastDate, "D MMM")}
          archiveLabel={fmtStorageDate(freshness.archiveDate, "D MMM")}
        />

        {/* Contextual action (mobile only): Thaw is big & central when frozen */}
        {showActions && state === "frozen" && (
          <Button
            variant="secondary"
            colour="accent"
            width="full"
            size="lg"
            onClick={onThaw}
            className="mt-4"
          >
            <Snowflake /> Thaw beans
          </Button>
        )}

        {/* Timeline: expanded inline (desktop) or behind a disclosure (mobile) */}
        {timelineExpanded ? (
          <div className="mt-5 border-t border-gray-100 pt-4 dark:border-white/10">
            <FreshnessTimeline freshness={freshness} today={today} />
          </div>
        ) : (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex w-full items-center justify-between py-1 text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Timeline &amp; dates
              <ChevronDown
                className={clsx("h-4 w-4 transition-transform", open && "rotate-180")}
              />
            </button>
            {open && (
              <div className="mt-2 border-t border-gray-100 pt-2.5 dark:border-white/10">
                <FreshnessTimeline freshness={freshness} today={today} />
              </div>
            )}
          </div>
        )}
      </Card.Content>
    </Card.Container>
  );
};

interface BarCaptionsProps {
  state: "open" | "frozen" | "thawed";
  isArchived: boolean;
  frozenDays: number;
  effectiveDays: number | null;
  roastLabel: string | null;
  archiveLabel: string | null;
}

const BarCaptions = ({
  state,
  isArchived,
  frozenDays,
  roastLabel,
  archiveLabel,
}: BarCaptionsProps) => {
  if (isArchived) {
    return (
      <div className="mt-1.5 flex justify-between text-[10.5px] font-medium text-gray-400 dark:text-gray-500">
        <span>{roastLabel ? `Roasted ${roastLabel}` : "Roasted"}</span>
        <span>{archiveLabel ? `Archived ${archiveLabel} · end` : "Archived · end"}</span>
      </div>
    );
  }
  if (state === "frozen") {
    return (
      <div className="mt-1.5 flex justify-between text-[10.5px] font-medium">
        <span className="text-orange-600 dark:text-orange-300">aging</span>
        <span className="text-blue-600 dark:text-blue-300">{frozenDays}d frozen</span>
      </div>
    );
  }
  if (state === "thawed") {
    return (
      <div className="mt-1.5 flex justify-between text-[10.5px] font-medium text-gray-400 dark:text-gray-500">
        <span className="text-orange-600 dark:text-orange-300">aging</span>
        <span className="text-blue-600 dark:text-blue-300">frozen {frozenDays}d</span>
        <span className="text-orange-600 dark:text-orange-300">now</span>
      </div>
    );
  }
  return (
    <div className="mt-1.5 flex justify-between text-[10.5px] font-medium text-gray-400 dark:text-gray-500">
      <span>{roastLabel ? `Roasted ${roastLabel}` : "Roasted"}</span>
      <span className="text-orange-600 dark:text-orange-300">now</span>
    </div>
  );
};

interface FreshnessTimelineProps {
  freshness: ReturnType<typeof getFreshness>;
  today: Date;
}

const FreshnessTimeline = ({ freshness, today }: FreshnessTimelineProps) => {
  const { roastDate, freezeDate, thawDate, archiveDate, state, isArchived } = freshness;

  return (
    <div className="space-y-1.5">
      {roastDate && (
        <Row
          label="Roasted"
          value={`${fmtStorageDate(roastDate)} · ${fmtDaysAgo(daysBetween(roastDate, today))}`}
        />
      )}
      {freezeDate && (
        <Row
          label="Frozen"
          tone="blue"
          value={
            thawDate
              ? `${fmtStorageDate(freezeDate)} · for ${daysBetween(freezeDate, thawDate)}d`
              : `${fmtStorageDate(freezeDate)} · for ${daysBetween(freezeDate, freshness.endDate)}d`
          }
        />
      )}
      {thawDate && (
        <Row
          label="Thawed"
          value={`${fmtStorageDate(thawDate)} · ${fmtDaysAgo(daysBetween(thawDate, today))}`}
        />
      )}
      {isArchived && archiveDate && (
        <Row label="Archived" value={`${fmtStorageDate(archiveDate)} · end of the line`} />
      )}
      {!isArchived && state === "frozen" && (
        <p className="pt-1 text-[11px] text-gray-400 dark:text-gray-500">
          Freezing pauses aging — the effective-age clock resumes the day you thaw.
        </p>
      )}
    </div>
  );
};

interface RowProps {
  label: string;
  value: string | null;
  tone?: "blue";
}

const Row = ({ label, value, tone }: RowProps) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span
      className={clsx(
        "font-semibold",
        tone === "blue" ? "text-blue-500 dark:text-blue-300" : "text-gray-800 dark:text-gray-200",
      )}
    >
      {value}
    </span>
  </div>
);
