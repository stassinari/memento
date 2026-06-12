export function isNotNullable<T>(x: T | null | undefined): x is T {
  return x != null;
}

export function immutableRemove<T>(array: T[], item: T) {
  return array.filter((i) => i !== item);
}

/**
 * Calendar-date helpers for Drizzle `date({ mode: "date" })` columns.
 *
 * A JS `Date` is an instant, not a calendar date. Drizzle serializes these
 * columns with `toISOString()` (UTC), while date pickers and `dayjs` read
 * calendar fields in the user's *local* timezone. For any non-UTC timezone the
 * same instant can land on two different days, which shifts stored dates by one.
 *
 * Convention: in app memory a calendar date is always a Date at *local* midnight
 * (what the picker produces and what `dayjs` displays). We translate only at the
 * DB boundary, and these conversions must run on the client where the user's
 * timezone is known (the server is typically UTC and can't recover it).
 */

/** app -> DB: local-midnight Date -> UTC-midnight, so its stored Y/M/D is the day the user picked. */
export function toStorageDate(date: Date | null | undefined): Date | null {
  if (!date) return null;
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

/** DB -> app: UTC-midnight Date -> local-midnight, so the picker and `dayjs` read back the same Y/M/D. */
export function fromStorageDate(date: Date | null | undefined): Date | null {
  if (!date) return null;
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function parseNullableNumberInput(value: string | null | undefined): number | null {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
// const YEAR = DAY * 365;

export function getTimeAgo(date: Date) {
  const secondsAgo = Math.round((Date.now() - Number(date)) / 1000);

  if (secondsAgo < MINUTE) {
    return secondsAgo + ` second${secondsAgo !== 1 ? "s" : ""} ago`;
  }

  let divisor: number;
  let unit = "";

  if (secondsAgo < HOUR) {
    [divisor, unit] = [MINUTE, "minute"];
  } else if (secondsAgo < DAY) {
    [divisor, unit] = [HOUR, "hour"];
  } else if (secondsAgo < 2 * MONTH) {
    [divisor, unit] = [DAY, "day"];
  } else if (secondsAgo < 4 * MONTH) {
    [divisor, unit] = [WEEK, "week"];
  } else {
    [divisor, unit] = [MONTH, "month"];
  }

  const count = Math.floor(secondsAgo / divisor);
  return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
}
