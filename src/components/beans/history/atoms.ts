import { ColumnOrderState, VisibilityState } from "@tanstack/react-table";
import { atomWithStorage } from "jotai/utils";
import { beansHistoryDefaultVisibility } from "./columns";

/**
 * Per-user column visibility for the History table, persisted to localStorage so
 * the chosen layout sticks across sessions. Columns absent from the stored
 * object default to visible (TanStack's behaviour), so adding a new default-on
 * column later doesn't require migrating stored preferences.
 */
export const beansHistoryColumnVisibilityAtom = atomWithStorage<VisibilityState>(
  "beans-history-column-visibility",
  beansHistoryDefaultVisibility,
);

/**
 * Per-user column order for the History table, persisted to localStorage. An
 * empty array means the natural definition order; once the user drags a column,
 * the full ordered id list is stored. Ids absent from the stored order (e.g. a
 * column added in a later release) fall to the end, so old preferences keep
 * working without migration.
 */
export const beansHistoryColumnOrderAtom = atomWithStorage<ColumnOrderState>(
  "beans-history-column-order",
  [],
);
