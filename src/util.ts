import { Beans } from "./types/beans";

export function isNotNullable<T>(x: T | null | undefined): x is T {
  return x != null;
}

export function immutableRemove<T>(array: T[], item: T) {
  return array.filter((i) => i !== item);
}

export const isNotFrozenOrIsThawed = (beans: Beans): boolean =>
  !beans.freezeDate || (!!beans.freezeDate && !!beans.thawDate);

export const isFrozen = (beans: Beans): boolean =>
  !!beans.freezeDate && !beans.thawDate;

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

export function getTimeAgo(date: Date) {
  const secondsAgo = Math.round((Date.now() - Number(date)) / 1000);

  if (secondsAgo < MINUTE) {
    return secondsAgo + ` second${secondsAgo !== 1 ? "s" : ""} ago`;
  }

  let divisor;
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
