import { BeansListItem } from "~/db/types";
import { StatusKey } from "./filters";

export interface BeansSummary {
  /** Number of beans in the (filtered) set. */
  total: number;
  /** Status qualifier shown beside the count, when the set is a single status. */
  statusLabel: string | null;
  roasterCount: number;
  topRoaster: { name: string; count: number } | null;
  countryCount: number;
  topCountry: { name: string; count: number } | null;
  /** Mean of the rated beans' avg scores, or null when none are rated. */
  avgScore: number | null;
  ratedCount: number;
}

const STATUS_QUALIFIER: Record<StatusKey, string> = {
  archived: "archived",
  open: "open",
  frozen: "frozen",
};

/** Distinct count + the most common value for a string field. */
const topOf = (
  beans: BeansListItem[],
  // eslint-disable-next-line no-unused-vars
  pick: (b: BeansListItem) => string | null | undefined,
): { count: number; top: { name: string; count: number } | null } => {
  const map = new Map<string, number>();
  for (const bean of beans) {
    const key = pick(bean);
    if (key == null || key === "") continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  let top: { name: string; count: number } | null = null;
  for (const [name, count] of map) {
    if (!top || count > top.count) top = { name, count };
  }
  return { count: map.size, top };
};

/** Summary figures for the History strip, computed over the currently-shown
 *  (filtered + searched) rows so the strip tracks what the table displays. */
export const deriveBeansSummary = (rows: BeansListItem[], statuses: StatusKey[]): BeansSummary => {
  const roasters = topOf(rows, (b) => b.roaster);
  const countries = topOf(rows, (b) => b.country);
  const rated = rows.filter((b) => b.avgScore != null);
  const avgScore = rated.length
    ? rated.reduce((sum, b) => sum + (b.avgScore as number), 0) / rated.length
    : null;

  return {
    total: rows.length,
    statusLabel: statuses.length === 1 ? STATUS_QUALIFIER[statuses[0]] : null,
    roasterCount: roasters.count,
    topRoaster: roasters.top,
    countryCount: countries.count,
    topCountry: countries.top,
    avgScore,
    ratedCount: rated.length,
  };
};
