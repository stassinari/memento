import { ChartBarIcon, FolderIcon, HomeIcon } from "@heroicons/react/outline";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "twin.macro";

const mobileNavigation: BottomNavItemProps[] = [
  { Icon: <HomeIcon />, label: "Home", to: "/" },
  { Icon: <FolderIcon />, label: "Beans", to: "/beans" },
  { Icon: <ChartBarIcon />, label: "Test", to: "/test" },
];

export const BottomNav = () => (
  <nav tw="fixed inset-x-0 bottom-0 z-10 bg-white shadow-md md:hidden ">
    <ol tw="flex justify-between ">
      {mobileNavigation.map(({ Icon, label, to }) => (
        <BottomNavItem key={label} Icon={Icon} label={label} to={to} />
      ))}
    </ol>
  </nav>
);

interface BottomNavItemProps {
  Icon: ReactNode;
  label: string;
  to: string;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({ Icon, label, to }) => (
  <li tw="inline-flex items-center justify-center w-full h-16 text-center">
    <Link
      to={to}
      tw="flex flex-col w-16 rounded-md focus:text-orange-500 hover:(text-orange-500 bg-gray-100)"
    >
      <span tw="w-8 h-8 mx-auto">{Icon}</span>
      <span tw="text-xs">{label}</span>
    </Link>
  </li>
);
