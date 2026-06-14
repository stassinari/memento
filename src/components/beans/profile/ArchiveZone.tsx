import { Archive, Undo2 } from "lucide-react";
import { Button } from "~/components/Button";

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
        <Button variant="white" width="full" onClick={onUnarchive}>
          <Undo2 /> Unarchive
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <Button variant="white" width="full" onClick={onArchive}>
        <Archive /> Archive these beans
      </Button>
      <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-gray-500">
        Moves to your archived cellar · still counts in stats
      </p>
    </div>
  );
};
