import { Link } from "@tanstack/react-router";
import { MoreVertical, Snowflake } from "lucide-react";
import { Button } from "~/components/Button";
import { DropdownMenu } from "~/components/DropdownMenu";
import { BeanActions } from "~/lib/beans";

interface BeanActionToolbarProps {
  actions: BeanActions;
  beansId: string;
  onFreeze: () => void;
  onThaw: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
}

/**
 * Desktop toolbar: Clone (ghost) · contextual Freeze/Thaw (blue) · divider ·
 * Archive/Unarchive (separated) · ⋯ overflow (Edit, Delete). Archive is kept
 * away from Freeze/Thaw by the divider — proximity caused real mis-taps.
 */
export const BeanActionToolbar = ({
  actions,
  beansId,
  onFreeze,
  onThaw,
  onArchive,
  onUnarchive,
  onDelete,
}: BeanActionToolbarProps) => (
  <div className="flex shrink-0 items-center gap-2">
    <Button variant="white" size="sm" asChild>
      <Link to="/beans/$beansId/clone" params={{ beansId }}>
        Clone
      </Link>
    </Button>

    {actions.canFreeze && (
      <Button variant="secondary" colour="accent" size="sm" onClick={onFreeze}>
        <Snowflake /> Freeze
      </Button>
    )}
    {actions.canThaw && (
      <Button variant="secondary" colour="accent" size="sm" onClick={onThaw}>
        <Snowflake /> Thaw beans
      </Button>
    )}

    <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-white/15" />

    {actions.canUnarchive ? (
      <Button variant="white" size="sm" onClick={onUnarchive}>
        Unarchive
      </Button>
    ) : (
      <Button variant="white" size="sm" onClick={onArchive}>
        Archive
      </Button>
    )}

    <DropdownMenu
      srLabel="More options"
      trigger={<MoreVertical className="h-5 w-5" aria-hidden="true" />}
      triggerClassName="grid h-9 w-9 place-items-center rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
      items={[
        { type: "link", label: "Edit details", linkProps: { to: "/beans/$beansId/edit", params: { beansId } } },
        { type: "button", label: "Delete", onClick: onDelete, danger: true },
      ]}
      panelClassName="w-44"
    />
  </div>
);
