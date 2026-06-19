/**
 * Shared underline-tab styling. Width is intentionally left to the caller —
 * tab strips differ (equal thirds, halves, fixed widths) — so this only owns
 * the padding, type, and the active/idle underline + colour.
 */
export const tabStyles = (isSelected: boolean) => [
  "border-b-2 px-1 py-4 text-center text-sm font-medium transition-colors",
  isSelected
    ? "text-orange-600 border-orange-500 dark:text-orange-400 dark:border-orange-400"
    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-400 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500",
];
