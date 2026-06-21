import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, LinkProps } from "@tanstack/react-router";
import clsx from "clsx";
import { ReactNode } from "react";

interface DropdownLink {
  type: "link";
  label: string;
  linkProps: LinkProps;
  /** Optional leading icon node (fully styled by the caller). */
  icon?: ReactNode;
}
interface DropdownButton {
  type: "button";
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  /** Render in the destructive (red) style. */
  danger?: boolean;
}
interface DropdownDivider {
  type: "divider";
}
export type DropdownItem = DropdownLink | DropdownButton | DropdownDivider;

interface DropdownMenuProps {
  /** Trigger content (an icon, a chevron, …). */
  trigger: ReactNode;
  /** Classes for the trigger button. */
  triggerClassName?: string;
  /** Accessible label for an icon-only trigger. */
  srLabel?: string;
  items: DropdownItem[];
  /** Which side to anchor the panel under the trigger. */
  align?: "start" | "end";
  /** Extra classes for the panel (e.g. a width). */
  panelClassName?: string;
}

const itemStyles =
  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700 dark:ui-active:bg-white/10 dark:ui-active:text-gray-100 dark:ui-not-active:text-gray-300";
const dangerItemStyles =
  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-600 ui-active:bg-red-50 dark:text-red-400 dark:ui-active:bg-red-500/10";

/**
 * The shared dropdown menu: a trigger button + an anchored, portalled panel of
 * link/button items (with optional icons, dividers and a danger style). The
 * panel renders at the document root, so an `overflow-hidden` ancestor (e.g. a
 * rounded card) can't clip it. Backs the row ⋯ menu, the split ButtonWithDropdown,
 * and the profile action overflow so they all share one look.
 */
export const DropdownMenu = ({
  trigger,
  triggerClassName,
  srLabel,
  items,
  align = "end",
  panelClassName,
}: DropdownMenuProps) => (
  <Menu>
    <MenuButton className={triggerClassName}>
      {srLabel && <span className="sr-only">{srLabel}</span>}
      {trigger}
    </MenuButton>
    <MenuItems
      anchor={align === "end" ? "bottom end" : "bottom start"}
      portal
      modal={false}
      transition
      className={clsx(
        "z-20 min-w-44 rounded-lg bg-white py-1 shadow-lg outline-1 outline-black/5 transition [--anchor-gap:0.25rem] data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-900 dark:outline-white/10",
        align === "end" ? "origin-top-right" : "origin-top-left",
        panelClassName,
      )}
    >
      {items.map((item, i) => {
        if (item.type === "divider") {
          return <div key={i} className="my-1 border-t border-gray-100 dark:border-white/10" />;
        }
        const className = item.type === "button" && item.danger ? dangerItemStyles : itemStyles;
        return (
          <MenuItem key={i}>
            {item.type === "link" ? (
              <Link {...item.linkProps} className={className}>
                {item.icon}
                {item.label}
              </Link>
            ) : (
              <button type="button" onClick={item.onClick} className={className}>
                {item.icon}
                {item.label}
              </button>
            )}
          </MenuItem>
        );
      })}
    </MenuItems>
  </Menu>
);
