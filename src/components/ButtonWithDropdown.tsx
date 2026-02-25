import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, LinkProps } from "@tanstack/react-router";
import clsx from "clsx";
import { Fragment } from "react";

interface LinkAction {
  type: "link";
  label: string;
  linkProps: LinkProps;
}

interface ButtonAction {
  type: "button";
  label: string;
  onClick: () => void;
}

export type Action = LinkAction | ButtonAction;

export interface ButtonWithDropdownProps {
  mainButton: Action;
  dropdownItems: Action[];
}

const dropdownItemStyles =
  "block w-full px-4 py-2 text-left text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700 dark:ui-active:bg-white/10 dark:ui-active:text-gray-100 dark:ui-not-active:text-gray-300";

const buttonStyles =
  "relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 dark:bg-white/10 dark:text-gray-100 dark:ring-white/15 dark:hover:bg-white/20";

export const ButtonWithDropdown = ({ mainButton, dropdownItems }: ButtonWithDropdownProps) => (
  <div className="inline-flex rounded-md shadow-xs">
    {mainButton.type === "link" ? (
      <Link {...mainButton.linkProps} className={clsx(buttonStyles)}>
        {mainButton.label}
      </Link>
    ) : (
      <button type="button" onClick={mainButton.onClick} className={clsx(buttonStyles)}>
        {mainButton.label}
      </button>
    )}

    <Menu as="div" className="relative block -ml-px">
      <MenuButton className="relative inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 dark:bg-white/10 dark:text-gray-300 dark:ring-white/15 dark:hover:bg-white/20">
        <span className="sr-only">Open options</span>
        <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
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
        <MenuItems className="absolute right-0 z-10 mt-2 -mr-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden dark:bg-gray-900 dark:ring-white/10">
          <div className="py-1">
            {dropdownItems.map((item) => (
              <MenuItem key={item.label}>
                {item.type === "link" ? (
                  <Link {...item.linkProps} className={clsx(dropdownItemStyles)}>
                    {item.label}
                  </Link>
                ) : (
                  <button onClick={item.onClick} className={clsx(dropdownItemStyles)}>
                    {item.label}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  </div>
);
