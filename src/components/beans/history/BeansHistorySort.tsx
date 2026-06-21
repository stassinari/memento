import { SortingState } from "@tanstack/react-table";
import clsx from "clsx";
import { BEANS_HISTORY_SORT_PRESETS, matchSortPreset } from "./sortPresets";

interface BeansHistorySortProps {
  sorting: SortingState;
  // eslint-disable-next-line no-unused-vars
  setSorting: (next: SortingState) => void;
}

/** "Sort by" radio list for the mobile filter sheet — sets the shared sorting
 *  state from a curated preset (there are no column headers to click on a
 *  phone). */
export const BeansHistorySort = ({ sorting, setSorting }: BeansHistorySortProps) => {
  const active = matchSortPreset(sorting)?.id ?? null;
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Sort by
      </p>
      <div className="mt-2 flex flex-col gap-0.5">
        {BEANS_HISTORY_SORT_PRESETS.map((preset) => {
          const selected = preset.id === active;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSorting(preset.sorting)}
              className="flex items-center gap-2.5 py-1.5 text-left text-sm"
            >
              <span
                className={clsx(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                  selected
                    ? "border-orange-500 dark:border-orange-400"
                    : "border-gray-300 dark:border-white/20",
                )}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-orange-500 dark:bg-orange-400" />}
              </span>
              <span className="text-gray-700 dark:text-gray-300">{preset.label}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{preset.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
