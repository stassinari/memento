import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, LinkProps } from "@tanstack/react-router";
import { DropdownMenu } from "./DropdownMenu";

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

const buttonStyles =
  "relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 dark:bg-white/10 dark:text-gray-100 dark:ring-white/15 dark:hover:bg-white/20";

/** A primary action with a dropdown of related actions, joined as a split
 *  button. The dropdown half is the shared `DropdownMenu`. */
export const ButtonWithDropdown = ({ mainButton, dropdownItems }: ButtonWithDropdownProps) => (
  <div className="inline-flex rounded-md shadow-xs">
    {mainButton.type === "link" ? (
      <Link {...mainButton.linkProps} className={buttonStyles}>
        {mainButton.label}
      </Link>
    ) : (
      <button type="button" onClick={mainButton.onClick} className={buttonStyles}>
        {mainButton.label}
      </button>
    )}

    <DropdownMenu
      srLabel="Open options"
      trigger={<ChevronDownIcon className="w-5 h-5" aria-hidden="true" />}
      triggerClassName="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 dark:bg-white/10 dark:text-gray-300 dark:ring-white/15 dark:hover:bg-white/20"
      items={dropdownItems}
      panelClassName="w-48"
    />
  </div>
);
