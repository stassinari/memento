import { Link, LinkProps } from "@tanstack/react-router";
import clsx from "clsx";
import { ReactNode, useMemo } from "react";
import { useActiveRoute } from "~/hooks/useActiveRoute";
import { useCurrentUser } from "~/hooks/useInitUser";
import useScreenMediaQuery from "~/hooks/useScreenMediaQuery";
import { navLinks } from "./BottomNav";
import { MementoLogo } from "./icons/MementoLogo";
import { ThemePicker } from "./ThemePicker";

const SidebarNavItem = ({ Icon, label, linkTo, nested = false }: SidebarNavItemProps) => {
  const isActive = useActiveRoute(linkTo);

  return (
    <Link
      to={linkTo}
      className={clsx([
        "group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-orange-400",
        nested && "ml-4",
        isActive && "bg-gray-50 text-orange-600 dark:bg-white/5 dark:text-orange-400",
      ])}
    >
      <span
        className={clsx([
          "mr-3 h-6 w-6 shrink-0 text-gray-400 group-hover:text-orange-600 dark:text-gray-500 dark:group-hover:text-orange-400",
          isActive && "text-orange-600 dark:text-orange-400",
        ])}
        aria-hidden="true"
      >
        {Icon}
      </span>
      {label}
    </Link>
  );
};

export interface SidebarNavItemProps {
  Icon: ReactNode;
  label: string;
  linkTo: LinkProps["to"];
  nested?: boolean;
}

export const SidebarNav = () => {
  const user = useCurrentUser();
  const secretKey = user.secretKey ?? null;

  const isLg = useScreenMediaQuery("lg");

  const sidebarNavLinks: SidebarNavItemProps[] = useMemo(
    () => [
      navLinks.home,
      navLinks.beans,
      navLinks.drinks,
      { ...navLinks.brews, nested: true },
      { ...navLinks.espresso, nested: true },
      { ...navLinks.tastings, nested: true },
      ...(secretKey ? [navLinks.decentUpload] : []),
      ...(user.role === "admin" || import.meta.env.MODE === "development"
        ? [navLinks.aiPlayground, navLinks.designLibrary]
        : []),
    ],
    [secretKey, user.role],
  );

  return (
    <div className="hidden md:flex md:w-48 md:flex-col md:fixed md:inset-y-0 lg:w-64">
      <div
        className={clsx([
          "grow gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-4 pb-4 dark:border-white/10 dark:bg-gray-900 lg:px-6",
        ])}
        style={{
          paddingLeft: `calc(env(safe-area-inset-left) + ${isLg ? "1.5rem" : "1rem"})`,
        }}
      >
        <div className="flex h-16 shrink-0 items-center">
          <MementoLogo className="max-h-8 w-auto dark:brightness-0 dark:invert" />
        </div>
        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col flex-1 gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1 ">
                {sidebarNavLinks.map(({ Icon, label, linkTo, nested }) => (
                  <li key={label}>
                    <SidebarNavItem Icon={Icon} label={label} linkTo={linkTo} nested={nested} />
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto space-y-4">
              <SidebarNavItem
                Icon={navLinks.settings.Icon}
                label={navLinks.settings.label}
                linkTo={navLinks.settings.linkTo}
              />
              <ThemePicker />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
