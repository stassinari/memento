import { SortingState } from "@tanstack/react-table";

export interface SortPreset {
  id: string;
  label: string;
  hint: string;
  sorting: SortingState;
}

/**
 * Curated single-tap sorts for the mobile sheet (no column headers to click on a
 * phone). Each maps onto the shared `sorting` state, so the choice is reflected
 * in the desktop column headers too. The first matches the table's default.
 */
export const BEANS_HISTORY_SORT_PRESETS: SortPreset[] = [
  {
    id: "archived",
    label: "Archive date",
    hint: "newest first",
    sorting: [
      { id: "archived", desc: true },
      { id: "roastDate", desc: true },
    ],
  },
  { id: "score", label: "Score", hint: "high to low", sorting: [{ id: "score", desc: true }] },
  {
    id: "roaster",
    label: "Roaster",
    hint: "A–Z",
    sorting: [
      { id: "roaster", desc: false },
      { id: "name", desc: false },
    ],
  },
  { id: "name", label: "Name", hint: "A–Z", sorting: [{ id: "name", desc: false }] },
];

const sortingEquals = (a: SortingState, b: SortingState): boolean =>
  a.length === b.length && a.every((s, i) => s.id === b[i].id && s.desc === b[i].desc);

/** The preset matching the current sort, or null for a custom (header-built) one. */
export const matchSortPreset = (sorting: SortingState): SortPreset | null =>
  BEANS_HISTORY_SORT_PRESETS.find((p) => sortingEquals(p.sorting, sorting)) ?? null;
