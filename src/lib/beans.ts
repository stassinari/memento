import { Beans } from "~/db/types";

/**
 * Pure, testable logic for the beans profile page.
 *
 * Date arithmetic runs in *storage space* (UTC-midnight, as Drizzle returns
 * `date({ mode: "date" })` columns) so whole-day diffs are exact and DST-proof.
 * Components apply `fromStorageDate` only when formatting for display.
 */

const MS_PER_DAY = 86_400_000;

/** Whole days from `a` to `b`, floored, never negative. Both must be UTC-midnight dates. */
export function daysBetween(a: Date, b: Date): number {
  return Math.max(0, Math.floor((b.getTime() - a.getTime()) / MS_PER_DAY));
}

/** UTC-midnight of the user's *local* today, to compare against stored dates. */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

// ---------------------------------------------------------------------------
// Freshness — the core new concept. "Effective age" = days actually aging;
// freezing pauses the clock, thawing resumes it, archiving ends the line.
// ---------------------------------------------------------------------------

export type FreshnessState = "open" | "frozen" | "thawed"; // archived is orthogonal

export interface Freshness {
  hasRoastDate: boolean;
  state: FreshnessState;
  isArchived: boolean;
  effectiveDays: number | null; // null when no roastDate
  calendarDays: number | null;
  frozenDays: number; // 0 when never frozen
  // raw storage-space dates for the timeline (format with fromStorageDate)
  roastDate: Date | null;
  freezeDate: Date | null;
  thawDate: Date | null;
  archiveDate: Date | null;
  endDate: Date; // where the timeline terminates (archiveDate or today)
}

export function getFreshness(bean: Beans, today: Date = startOfToday()): Freshness {
  const { roastDate, freezeDate, thawDate, archiveDate, isArchived } = bean;

  const frozen = !!freezeDate && !thawDate;
  const thawed = !!freezeDate && !!thawDate;
  const state: FreshnessState = frozen ? "frozen" : thawed ? "thawed" : "open";

  // Archived caps the timeline at archiveDate (the "end of the line").
  // Legacy archived rows have archiveDate = null → fall back to today.
  const endDate = isArchived && archiveDate ? archiveDate : today;

  if (!roastDate) {
    return {
      hasRoastDate: false,
      state,
      isArchived,
      effectiveDays: null,
      calendarDays: null,
      frozenDays: 0,
      roastDate: null,
      freezeDate,
      thawDate,
      archiveDate,
      endDate,
    };
  }

  const calendarDays = daysBetween(roastDate, endDate);

  let frozenDays = 0;
  if (thawed) frozenDays = daysBetween(freezeDate!, thawDate!);
  else if (frozen) frozenDays = daysBetween(freezeDate!, endDate); // still frozen → up to end

  // Active aging only. While frozen the clock is paused at freezeDate.
  const effectiveDays = frozen ? daysBetween(roastDate, freezeDate!) : calendarDays - frozenDays; // open: frozenDays = 0 → effective == calendar

  return {
    hasRoastDate: true,
    state,
    isArchived,
    effectiveDays,
    calendarDays,
    frozenDays,
    roastDate,
    freezeDate,
    thawDate,
    archiveDate,
    endDate,
  };
}

// ---------------------------------------------------------------------------
// Default sort comparators, one per Beans tab. A bean with no roast date always
// sinks to the bottom (it has no meaningful age/freshness to rank by).
// ---------------------------------------------------------------------------

/** Newest first, nulls last. Both dates are storage-space (UTC-midnight). */
function dateDesc(a: Date | null, b: Date | null): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return b.getTime() - a.getTime();
}

/** Open → effective age ascending (freshest first), undated last. */
export function compareByFreshness(a: Beans, b: Beans): number {
  return (getFreshness(a).effectiveDays ?? Infinity) - (getFreshness(b).effectiveDays ?? Infinity);
}

/** Frozen → most recently frozen first. */
export function compareByFreezeDate(a: Beans, b: Beans): number {
  return dateDesc(a.freezeDate, b.freezeDate);
}

/** History → archive date, falling back to roast date when absent. */
export function compareByArchiveDate(a: Beans, b: Beans): number {
  return dateDesc(a.archiveDate ?? a.roastDate, b.archiveDate ?? b.roastDate);
}

// ---------------------------------------------------------------------------
// Status — single source that drives pill colour + contextual action.
// ---------------------------------------------------------------------------

export type BeanStatus = FreshnessState | "archived";

export function getBeanStatus(bean: Beans): BeanStatus {
  if (bean.isArchived) return "archived";
  const frozen = !!bean.freezeDate && !bean.thawDate;
  const thawed = !!bean.freezeDate && !!bean.thawDate;
  return frozen ? "frozen" : thawed ? "thawed" : "open";
}

// Which lifecycle actions are available — the single source of truth shared by
// the desktop toolbar and the mobile freshness card (keyed off status, so
// archived beans never expose freeze/thaw).
export interface BeanActions {
  canFreeze: boolean;
  canThaw: boolean;
  canArchive: boolean;
  canUnarchive: boolean;
}

export function getBeanActions(bean: Beans): BeanActions {
  const status = getBeanStatus(bean);
  return {
    canFreeze: status === "open",
    canThaw: status === "frozen",
    canArchive: status !== "archived",
    canUnarchive: status === "archived",
  };
}

// ---------------------------------------------------------------------------
// Descriptor — the natural-language "what is it" pill text. The flag is
// rendered separately (via CountryOptionFlag) when `country` is present.
// ---------------------------------------------------------------------------

export function getBeanDescriptor(
  bean: Pick<Beans, "origin" | "country" | "process" | "blendParts">,
): string {
  if (bean.origin === "blend") {
    const n = bean.blendParts?.length ?? 0;
    return n > 0 ? `Blend · ${n} part${n === 1 ? "" : "s"}` : "Blend";
  }
  const { process, country } = bean;
  if (process && country) return `${country} · ${process}`;
  if (country) return country;
  if (process) return process;
  return "Single origin";
}

// ---------------------------------------------------------------------------
// Roast level — 0–4 → named scale. Backed by an array so a future "Ultralight"
// can be prepended (it shifts the scale; never hardcode indices elsewhere).
// ---------------------------------------------------------------------------

export const ROAST_LEVELS = ["Light", "Medium-light", "Medium", "Medium-dark", "Dark"] as const;

export function getRoastLevelLabel(level: number | null | undefined): string | null {
  if (level === null || level === undefined) return null;
  return ROAST_LEVELS[level] ?? null;
}

// Display labels for the roast-style enum ("filter" | "espresso" | "omni-roast").
export const ROAST_STYLE_LABELS: Record<string, string> = {
  filter: "Filter",
  espresso: "Espresso",
  "omni-roast": "Omni-roast",
};

export function getRoastStyleLabel(style: string | null | undefined): string | null {
  if (!style) return null;
  return ROAST_STYLE_LABELS[style] ?? style;
}

// ---------------------------------------------------------------------------
// Age formatting — exact day counts get irrelevant for old beans. Count days up
// to ~4 months, then round to months, and to years past ~24 months.
// ---------------------------------------------------------------------------

export interface FormattedAge {
  value: number;
  unit: string; // already singular/plural for `value`
}

const DAYS_TO_MONTHS = 120; // ~4 months
const DAYS_TO_YEARS = 730; // ~24 months

export function formatAge(days: number): FormattedAge {
  if (days < DAYS_TO_MONTHS) return { value: days, unit: days === 1 ? "day" : "days" };
  if (days < DAYS_TO_YEARS) {
    const months = Math.round(days / 30);
    return { value: months, unit: months === 1 ? "month" : "months" };
  }
  const years = Math.round(days / 365);
  return { value: years, unit: years === 1 ? "year" : "years" };
}

// ---------------------------------------------------------------------------
// Activity — aggregate over linked brews / espressos / tasting samples.
// Avg score uses *rated* drinks only (brews/espressos `rating`, tastings `overall`).
// ---------------------------------------------------------------------------

export interface ActivitySummary {
  totalCount: number;
  brewCount: number;
  espressoCount: number;
  tastingCount: number;
  ratedCount: number;
  avgScore: number | null; // null when nothing rated
}

export function getActivitySummary(data: {
  brews: { rating: number | null }[];
  espressos: { rating: number | null }[];
  sampledInTastings: { overall: number | null }[];
}): ActivitySummary {
  const brewCount = data.brews.length;
  const espressoCount = data.espressos.length;
  const tastingCount = data.sampledInTastings.length;

  const scores = [
    ...data.brews.map((b) => b.rating),
    ...data.espressos.map((e) => e.rating),
    ...data.sampledInTastings.map((t) => t.overall),
  ].filter((s): s is number => s !== null);

  const ratedCount = scores.length;
  const avgScore = ratedCount > 0 ? scores.reduce((sum, s) => sum + s, 0) / ratedCount : null;

  return {
    totalCount: brewCount + espressoCount + tastingCount,
    brewCount,
    espressoCount,
    tastingCount,
    ratedCount,
    avgScore,
  };
}
