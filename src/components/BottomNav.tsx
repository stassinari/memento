import { css } from "@emotion/react";
import {
  ArrowUpOnSquareIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CurrencyEuroIcon,
  CurrencyPoundIcon,
  CurrencyYenIcon,
  FolderIcon,
  HomeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import tw, { theme } from "twin.macro";
import { useActiveRoute } from "../hooks/useActiveRoute";

export const navLinks = {
  home: {
    label: "Home",
    linkTo: "/",
    Icon: <HomeIcon />,
  },
  beans: {
    label: "Beans",
    linkTo: "/beans",
    Icon: <FolderIcon />,
  },
  drinks: {
    label: "Drinks",
    linkTo: "/drinks",
    Icon: <ChartBarIcon />,
  },
  brews: {
    label: "Brews",
    linkTo: "/drinks/brews",
    Icon: <CurrencyEuroIcon />,
  },
  espresso: {
    label: "Espresso",
    linkTo: "/drinks/espresso",
    Icon: <CurrencyPoundIcon />,
  },
  tastings: {
    label: "Tastings",
    linkTo: "/drinks/tastings",
    Icon: <CurrencyYenIcon />,
  },
  decentUpload: {
    label: "Decent upload",
    linkTo: "/decent-upload",
    Icon: <ArrowUpOnSquareIcon />,
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
    css={[
      tw`fixed inset-x-0 bottom-0 z-10 bg-white shadow-2xl md:hidden`,
      css`
        height: calc(env(safe-area-inset-bottom) + ${theme`spacing.14`});
        padding-bottom: env(safe-area-inset-bottom);
      `,
    ]}
  >
    <ol tw="flex justify-between h-full">
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

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  Icon,
  label,
  linkTo,
}) => {
  const isActive = useActiveRoute(linkTo);

  return (
    <li tw="inline-flex items-center justify-center w-full p-1 text-center">
      <Link
        className="group"
        to={linkTo}
        css={[
          tw`flex flex-col gap-0.5 w-full h-full justify-center rounded-md hover:bg-gray-100`,
          isActive ? tw`bg-gray-50` : tw``,
        ]}
      >
        <span
          css={[
            tw`w-6 h-6 mx-auto`,
            isActive
              ? tw`text-orange-600`
              : tw`text-gray-400 group-hover:text-gray-500`,
          ]}
        >
          {Icon}
        </span>
        <span
          css={[
            tw`text-xs font-medium`,
            isActive
              ? tw`text-orange-600`
              : tw`text-gray-600 group-hover:text-gray-900`,
          ]}
        >
          {label}
        </span>
      </Link>
    </li>
  );
};
