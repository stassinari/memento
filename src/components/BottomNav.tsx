import {
  ArrowUpOnSquareIcon,
  Cog6ToothIcon,
  FlagIcon,
  HomeIcon,
  PhotoIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { ReactNode } from "react";
import { useActiveRoute } from "~/hooks/useActiveRoute";
import { BeansIconOutline } from "./icons/BeansIconOutline";
import { DrinkIcon } from "./icons/DrinkIcon";
import { EspressoIcon } from "./icons/EspressoIcon";
import { FrenchPressIcon } from "./icons/FrenchPressIcon";
import { SpoonIcon } from "./icons/SpoonIcon";

export const navLinks = {
  home: {
    label: "Home",
    linkTo: "/",
    Icon: <HomeIcon />,
  },
  beans: {
    label: "Beans",
    linkTo: "/beans",
    Icon: <BeansIconOutline />,
  },
  drinks: {
    label: "Drinks",
    linkTo: "/drinks",
    Icon: <DrinkIcon />,
  },
  brews: {
    label: "Brews",
    linkTo: "/drinks/brews",
    Icon: <FrenchPressIcon />,
  },
  espresso: {
    label: "Espresso",
    linkTo: "/drinks/espresso",
    Icon: <EspressoIcon />,
  },
  tastings: {
    label: "Tastings",
    linkTo: "/drinks/tastings",
    Icon: <SpoonIcon />,
  },
  decentUpload: {
    label: "Decent upload",
    linkTo: "/decent-upload",
    Icon: <ArrowUpOnSquareIcon />,
  },
  aiPlayground: {
    label: "AI playground",
    linkTo: "/ai",
    Icon: <SparklesIcon />,
  },
  featureFlags: {
    label: "Feature Flags",
    linkTo: "/featureFlags",
    Icon: <FlagIcon />,
  },
  settings: {
    label: "Settings",
    linkTo: "/settings",
    Icon: <Cog6ToothIcon />,
  },
  designLibrary: {
    label: "Design library",
    linkTo: "/design-library",
    Icon: <PhotoIcon />,
  },
};

const bottomNavLinks: BottomNavItemProps[] = [
  navLinks.home,
  navLinks.beans,
  navLinks.drinks,
  navLinks.settings,
];

export const BottomNav = () => (
  <nav
    className="fixed inset-x-0 bottom-0 z-10 bg-white shadow-2xl md:hidden"
    style={{
      paddingBottom: `calc(env(safe-area-inset-bottom) + 3.5rem)`,
      height: `calc(env(safe-area-inset-bottom) + 3.5rem)`,
    }}
  >
    <ol className="flex justify-between h-14">
      {bottomNavLinks.map(({ Icon, label, linkTo: to }) => (
        <BottomNavItem key={label} Icon={Icon} label={label} linkTo={to} />
      ))}
    </ol>
  </nav>
);

interface BottomNavItemProps {
  Icon: ReactNode;
  label: string;
  linkTo: string;
}

const BottomNavItem = ({ Icon, label, linkTo }: BottomNavItemProps) => {
  const isActive = useActiveRoute(linkTo);

  return (
    <li className="inline-flex items-center justify-center w-full p-1 text-center">
      <Link
        to={linkTo}
        className={clsx([
          "group",
          "flex flex-col gap-0.5 w-full h-full justify-center rounded-md hover:bg-gray-100",
          isActive ? "bg-gray-50" : "",
        ])}
      >
        <span
          className={clsx([
            "w-6 h-6 mx-auto",
            isActive
              ? "text-orange-600"
              : "text-gray-400 group-hover:text-gray-500",
          ])}
        >
          {Icon}
        </span>
        <span
          className={clsx([
            "text-xs font-medium",
            isActive
              ? "text-orange-600"
              : "text-gray-600 group-hover:text-gray-900",
          ])}
        >
          {label}
        </span>
      </Link>
    </li>
  );
};
