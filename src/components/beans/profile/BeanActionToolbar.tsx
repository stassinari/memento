import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { MoreVertical, Snowflake } from "lucide-react";
import { Fragment } from "react";
import { Button } from "~/components/Button";
import { BeanStatus } from "~/lib/beans";

const menuItemStyles =
  "block w-full px-4 py-2 text-left text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700 dark:ui-active:bg-white/10 dark:ui-active:text-gray-100 dark:ui-not-active:text-gray-300";

interface BeanActionToolbarProps {
  status: BeanStatus;
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
  status,
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

    {status === "open" && (
      <Button variant="secondary" colour="accent" size="sm" onClick={onFreeze}>
        <Snowflake /> Freeze
      </Button>
    )}
    {status === "frozen" && (
      <Button variant="secondary" colour="accent" size="sm" onClick={onThaw}>
        <Snowflake /> Thaw beans
      </Button>
    )}

    <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-white/15" />

    {status === "archived" ? (
      <Button variant="white" size="sm" onClick={onUnarchive}>
        Unarchive
      </Button>
    ) : (
      <Button variant="white" size="sm" onClick={onArchive}>
        Archive
      </Button>
    )}

    <Menu as="div" className="relative">
      <MenuButton className="grid h-9 w-9 place-items-center rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10">
        <span className="sr-only">More options</span>
        <MoreVertical className="h-5 w-5" aria-hidden="true" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden dark:bg-gray-900 dark:ring-white/10">
          <div className="py-1">
            <MenuItem>
              <Link
                to="/beans/$beansId/edit"
                params={{ beansId }}
                className={clsx(menuItemStyles)}
              >
                Edit details
              </Link>
            </MenuItem>
            <MenuItem>
              <button type="button" onClick={onDelete} className={clsx(menuItemStyles)}>
                Delete
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  </div>
);
