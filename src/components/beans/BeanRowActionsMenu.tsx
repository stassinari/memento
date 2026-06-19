import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Archive, ArchiveRestore, Copy, MoreVertical, Pencil, Snowflake, Trash2 } from "lucide-react";
import { Fragment } from "react";
import { Beans } from "~/db/types";
import { getBeanActions } from "~/lib/beans";
import { UseBeanActions } from "~/hooks/useBeanActions";

const itemStyles =
  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700 dark:ui-active:bg-white/10 dark:ui-active:text-gray-100 dark:ui-not-active:text-gray-300";
const dangerItemStyles =
  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-600 ui-active:bg-red-50 dark:text-red-400 dark:ui-active:bg-red-500/10";
const iconStyles = "h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500";

interface BeanRowActionsMenuProps {
  bean: Beans;
  actions: UseBeanActions;
}

/**
 * The per-row ⋯ menu for a bean: contextual Freeze/Thaw · Clone · Archive ·
 * Edit · Delete (kept apart, in red). Lifecycle behaviour is delegated to the
 * shared `useBeanActions` hook so list rows and the History table stay in sync.
 */
export const BeanRowActionsMenu = ({ bean, actions }: BeanRowActionsMenuProps) => {
  const can = getBeanActions(bean);

  return (
    <Menu as="div" className="relative">
      <MenuButton className="grid h-7 w-7 place-items-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300">
        <span className="sr-only">Bean actions</span>
        <MoreVertical className="h-4 w-4" aria-hidden="true" />
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
        <MenuItems className="absolute right-0 z-20 mt-1 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden dark:bg-gray-900 dark:ring-white/10">
          {can.canFreeze && (
            <MenuItem>
              <button type="button" onClick={() => actions.freeze(bean.id)} className={clsx(itemStyles)}>
                <Snowflake className="h-4 w-4 shrink-0 text-blue-500" />
                Freeze beans
              </button>
            </MenuItem>
          )}
          {can.canThaw && (
            <MenuItem>
              <button type="button" onClick={() => actions.thaw(bean.id)} className={clsx(itemStyles)}>
                <Snowflake className="h-4 w-4 shrink-0 text-blue-500" />
                Thaw beans
              </button>
            </MenuItem>
          )}
          <MenuItem>
            <Link to="/beans/$beansId/clone" params={{ beansId: bean.id }} className={clsx(itemStyles)}>
              <Copy className={iconStyles} />
              Clone
            </Link>
          </MenuItem>

          <div className="my-1 border-t border-gray-100 dark:border-white/10" />

          {can.canUnarchive ? (
            <MenuItem>
              <button
                type="button"
                onClick={() => actions.unarchive(bean.id)}
                className={clsx(itemStyles)}
              >
                <ArchiveRestore className={iconStyles} />
                Unarchive
              </button>
            </MenuItem>
          ) : (
            <MenuItem>
              <button
                type="button"
                onClick={() => actions.archive(bean.id)}
                className={clsx(itemStyles)}
              >
                <Archive className={iconStyles} />
                Archive
              </button>
            </MenuItem>
          )}

          <div className="my-1 border-t border-gray-100 dark:border-white/10" />

          <MenuItem>
            <Link to="/beans/$beansId/edit" params={{ beansId: bean.id }} className={clsx(itemStyles)}>
              <Pencil className={iconStyles} />
              Edit details
            </Link>
          </MenuItem>
          <MenuItem>
            <button type="button" onClick={() => actions.remove(bean.id)} className={clsx(dangerItemStyles)}>
              <Trash2 className="h-4 w-4 shrink-0" />
              Delete
            </button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
};
