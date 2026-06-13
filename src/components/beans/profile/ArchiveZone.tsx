import { ArchiveBoxIcon, ArrowUturnLeftIcon } from "@heroicons/react/20/solid";

interface ArchiveZoneProps {
  isArchived: boolean;
  onArchive: () => void;
  onUnarchive: () => void;
}

/**
 * The one always-present lifecycle footer. Kept in its own zone, far from
 * Freeze/Thaw, to avoid the mis-tap that the old adjacent-dropdown layout caused.
 */
export const ArchiveZone = ({ isArchived, onArchive, onUnarchive }: ArchiveZoneProps) => {
  if (isArchived) {
    return (
      <div className="pt-2">
        <button
          type="button"
          onClick={onUnarchive}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-gray-300 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <ArrowUturnLeftIcon className="h-[18px] w-[18px]" /> Unarchive
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={onArchive}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-gray-300 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
      >
        <ArchiveBoxIcon className="h-[18px] w-[18px]" /> Archive these beans
      </button>
      <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-gray-500">
        Moves to your archived cellar · still counts in stats
      </p>
    </div>
  );
};
