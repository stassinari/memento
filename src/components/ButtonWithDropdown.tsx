import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
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
  "w-full text-left block px-4 py-2 text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700";

const buttonStyles =
  "relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10";

export const ButtonWithDropdown = ({
  mainButton,
  dropdownItems,
}: ButtonWithDropdownProps) => (
  <div className="inline-flex rounded-md shadow-xs">
    {mainButton.type === "link" ? (
      <Link {...mainButton.linkProps} className={clsx(buttonStyles)}>
        {mainButton.label}
      </Link>
    ) : (
      <button
        type="button"
        onClick={mainButton.onClick}
        className={clsx(buttonStyles)}
      >
        {mainButton.label}
      </button>
    )}

    <Menu as="div" className="relative block -ml-px">
      <MenuButton className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
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
        <MenuItems className="absolute right-0 z-10 w-48 mt-2 -mr-1 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-hidden">
          <div className="py-1">
            {dropdownItems.map((item) => (
              <MenuItem key={item.label}>
                {item.type === "link" ? (
                  <Link
                    {...item.linkProps}
                    className={clsx(dropdownItemStyles)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className={clsx(dropdownItemStyles)}
                  >
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
