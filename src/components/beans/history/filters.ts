import { BeansListItem } from "~/db/types";
import { getRoastLevelLabel } from "~/lib/beans";
import { roundToDecimal } from "~/utils";

export type StatusKey = "archived" | "open" | "frozen";

export interface BeansFilters {
  statuses: StatusKey[];
  roasters: string[];
  countries: string[];
  processes: string[];
  roastLevels: number[];
  years: number[]; // archive years
  roastYears: number[];
  scoreMin: number | null;
  scoreMax: number | null;
}

// History defaults to the archived cellar; the user folds Open/Frozen back in.
export const defaultBeansFilters: BeansFilters = {
  statuses: ["archived"],
  roasters: [],
  countries: [],
  processes: [],
  roastLevels: [],
  years: [],
  roastYears: [],
  scoreMin: null,
  scoreMax: null,
};

export const beanMatchesStatus = (bean: BeansListItem, statuses: StatusKey[]): boolean =>
  statuses.some((s) =>
    s === "archived" ? bean.isArchived : s === "open" ? bean.isOpen : bean.isFrozen,
  );

export const beanArchiveYear = (bean: BeansListItem): number | null =>
  bean.archiveDate ? new Date(bean.archiveDate).getUTCFullYear() : null;

export const beanRoastYear = (bean: BeansListItem): number | null =>
  bean.roastDate ? new Date(bean.roastDate).getUTCFullYear() : null;

export const matchesSearch = (bean: BeansListItem, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return bean.name.toLowerCase().includes(q) || (bean.roaster?.toLowerCase().includes(q) ?? false);
};

/** Status scope only — the dataset the facet options/counts are derived from. */
export const filterByStatus = (beans: BeansListItem[], statuses: StatusKey[]): BeansListItem[] =>
  beans.filter((bean) => beanMatchesStatus(bean, statuses));

/** The non-status facets + score (applied on top of the status scope). */
export const applyFacets = (beans: BeansListItem[], f: BeansFilters): BeansListItem[] =>
  beans.filter((bean) => {
    if (f.roasters.length && !f.roasters.includes(bean.roaster)) return false;
    if (f.countries.length && !(bean.country && f.countries.includes(bean.country))) return false;
    if (f.processes.length && !(bean.process && f.processes.includes(bean.process))) return false;
    if (f.roastLevels.length && !(bean.roastLevel != null && f.roastLevels.includes(bean.roastLevel)))
      return false;
    if (f.years.length) {
      const year = beanArchiveYear(bean);
      if (!(year != null && f.years.includes(year))) return false;
    }
    if (f.roastYears.length) {
      const year = beanRoastYear(bean);
      if (!(year != null && f.roastYears.includes(year))) return false;
    }
    if (f.scoreMin != null && (bean.avgScore == null || bean.avgScore < f.scoreMin)) return false;
    if (f.scoreMax != null && (bean.avgScore == null || bean.avgScore > f.scoreMax)) return false;
    return true;
  });

/** Number of active (non-status) facet selections — drives the Filters badge. */
export const countActiveFilters = (f: BeansFilters): number =>
  f.roasters.length +
  f.countries.length +
  f.processes.length +
  f.roastLevels.length +
  f.years.length +
  f.roastYears.length +
  (f.scoreMin != null || f.scoreMax != null ? 1 : 0);

export interface FilterChip {
  id: string;
  label: string;
  remove: (f: BeansFilters) => BeansFilters;
}

const without = <T,>(arr: T[], value: T): T[] => arr.filter((v) => v !== value);

/** Removable chips for the active (non-status) filters, shown under the toolbar. */
export const getActiveFilterChips = (f: BeansFilters): FilterChip[] => {
  const chips: FilterChip[] = [];
  for (const r of f.roasters)
    chips.push({ id: `roaster:${r}`, label: r, remove: (x) => ({ ...x, roasters: without(x.roasters, r) }) });
  for (const c of f.countries)
    chips.push({ id: `country:${c}`, label: c, remove: (x) => ({ ...x, countries: without(x.countries, c) }) });
  for (const p of f.processes)
    chips.push({ id: `process:${p}`, label: p, remove: (x) => ({ ...x, processes: without(x.processes, p) }) });
  for (const lvl of f.roastLevels)
    chips.push({
      id: `roast:${lvl}`,
      label: getRoastLevelLabel(lvl) ?? `Roast ${lvl}`,
      remove: (x) => ({ ...x, roastLevels: without(x.roastLevels, lvl) }),
    });
  for (const y of f.years)
    chips.push({
      id: `year:${y}`,
      label: `Archived ${y}`,
      remove: (x) => ({ ...x, years: without(x.years, y) }),
    });
  for (const y of f.roastYears)
    chips.push({
      id: `roastYear:${y}`,
      label: `Roasted ${y}`,
      remove: (x) => ({ ...x, roastYears: without(x.roastYears, y) }),
    });
  if (f.scoreMin != null || f.scoreMax != null) {
    const lo = f.scoreMin != null ? roundToDecimal(f.scoreMin, 1) : "0";
    const hi = f.scoreMax != null ? roundToDecimal(f.scoreMax, 1) : "10";
    chips.push({
      id: "score",
      label: `Score ${lo}–${hi}`,
      remove: (x) => ({ ...x, scoreMin: null, scoreMax: null }),
    });
  }
  return chips;
};

export interface FacetOption {
  value: string;
  count: number;
}

const countBy = (beans: BeansListItem[], pick: (b: BeansListItem) => string | null | undefined) => {
  const map = new Map<string, number>();
  for (const bean of beans) {
    const key = pick(bean);
    if (key == null || key === "") continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
};

const toSortedOptions = (map: Map<string, number>): FacetOption[] =>
  [...map.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

/** Facet option lists (with counts) derived from the status-scoped dataset. */
export const deriveFacetOptions = (scoped: BeansListItem[]) => ({
  roasters: toSortedOptions(countBy(scoped, (b) => b.roaster)),
  countries: toSortedOptions(countBy(scoped, (b) => b.country)),
  processes: toSortedOptions(countBy(scoped, (b) => b.process)),
  // Roast levels read Light → Dark (by level index), not by count.
  roastLevels: [...countBy(scoped, (b) => (b.roastLevel != null ? String(b.roastLevel) : null)).entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => Number(a.value) - Number(b.value)),
  years: [...countBy(scoped, (b) => { const y = beanArchiveYear(b); return y != null ? String(y) : null; }).entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => Number(b.value) - Number(a.value)),
  roastYears: [...countBy(scoped, (b) => { const y = beanRoastYear(b); return y != null ? String(y) : null; }).entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => Number(b.value) - Number(a.value)),
});

/** Status counts come from the *whole* history set, not the current scope. */
export const deriveStatusCounts = (all: BeansListItem[]) => ({
  archived: all.filter((b) => b.isArchived).length,
  open: all.filter((b) => b.isOpen).length,
  frozen: all.filter((b) => b.isFrozen).length,
});
