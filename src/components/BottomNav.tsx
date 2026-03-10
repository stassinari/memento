import {
  ArrowUpOnSquareIcon,
  Cog6ToothIcon,
  HomeIcon,
  PhotoIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link, LinkProps } from "@tanstack/react-router";
import clsx from "clsx";
import { ReactNode } from "react";
import { useActiveRoute } from "~/hooks/useActiveRoute";
import { BeansIconOutline } from "./icons/BeansIconOutline";
import { BowlIcon } from "./icons/BowlIcon";
import { DrinkIcon } from "./icons/DrinkIcon";
import { EspressoIcon } from "./icons/EspressoIcon";
import { FrenchPressIcon } from "./icons/FrenchPressIcon";

type NavLink = {
  label: string;
  link: LinkProps;
  Icon: ReactNode;
};

export const navLinks: Record<string, NavLink> = {
  home: {
    label: "Home",
    link: { to: "/" },
    Icon: <HomeIcon />,
  },
  beans: {
    label: "Beans",
    link: { to: "/beans" },
    Icon: <BeansIconOutline />,
  },
  drinks: {
    label: "Drinks",
    link: { to: "/drinks" },
    Icon: <DrinkIcon />,
  },
  brews: {
    label: "Brews",
    link: { to: "/drinks/brews" },
    Icon: <FrenchPressIcon />,
  },
  espresso: {
    label: "Espresso",
    link: { to: "/drinks/espresso" },
    Icon: <EspressoIcon />,
  },
  tastings: {
    label: "Tastings",
    link: { to: "/drinks/tastings" },
    Icon: <BowlIcon />,
  },
  decentUpload: {
    label: "Decent upload",
    link: { to: "/decent-upload" },
    Icon: <ArrowUpOnSquareIcon />,
  },
  aiPlayground: {
    label: "AI playground",
    link: { to: "/ai" },
    Icon: <SparklesIcon />,
  },
  settings: {
    label: "Settings",
    link: { to: "/settings" },
    Icon: <Cog6ToothIcon />,
  },
  designLibrary: {
    label: "Design library",
    link: { to: "/design-library" },
    Icon: <PhotoIcon />,
  },
};

const bottomNavLinks: NavLink[] = [
  navLinks.home,
  navLinks.beans,
  navLinks.drinks,
  navLinks.settings,
];

export const BottomNav = () => (
  <nav
    className="fixed inset-x-0 bottom-0 z-10 bg-white shadow-2xl dark:bg-gray-900 dark:shadow-black/40 md:hidden"
    style={{
      paddingBottom: `calc(env(safe-area-inset-bottom) + 3.5rem)`,
      height: `calc(env(safe-area-inset-bottom) + 3.5rem)`,
    }}
  >
    <ol className="flex justify-between h-14">
      {bottomNavLinks.map(({ Icon, label, link }) => (
        <BottomNavItem key={label} Icon={Icon} label={label} link={link} />
      ))}
    </ol>
  </nav>
);

interface BottomNavItemProps {
  Icon: ReactNode;
  label: string;
  link: LinkProps;
}

const BottomNavItem = ({ Icon, label, link }: BottomNavItemProps) => {
  const isActive = useActiveRoute(link);

  return (
    <li className="inline-flex items-center justify-center w-full p-1 text-center">
      <Link
        {...link}
        className={clsx([
          "group",
          "flex h-full w-full flex-col justify-center gap-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10",
          isActive ? "bg-gray-50 dark:bg-white/10" : "",
        ])}
      >
        <span
          className={clsx([
            "w-6 h-6 mx-auto",
            isActive
              ? "text-orange-600 dark:text-orange-400"
              : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300",
          ])}
        >
          {Icon}
        </span>
        <span
          className={clsx([
            "text-xs font-medium",
            isActive
              ? "text-orange-600 dark:text-orange-400"
              : "text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100",
          ])}
        >
          {label}
        </span>
      </Link>
    </li>
  );
};
