import { ChartBarIcon, FolderIcon, HomeIcon } from "@heroicons/react/outline";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "twin.macro";
import tw from "twin.macro";

const mobileNavigation: BottomNavItemProps[] = [
  { Icon: <HomeIcon />, label: "Home", to: "/", current: true },
  { Icon: <FolderIcon />, label: "Beans", to: "/beans" },
  { Icon: <ChartBarIcon />, label: "Test", to: "/test" },
];

export const BottomNav = () => (
  <nav tw="fixed inset-x-0 bottom-0 z-10 bg-white shadow-2xl md:hidden ">
    <ol tw="flex justify-between">
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
  current?: boolean;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  Icon,
  label,
  to,
  current,
}) => (
  <li tw="inline-flex items-center justify-center w-full p-1 text-center h-14 ">
    <Link
      className="group"
      to={to}
      css={[
        tw`flex flex-col gap-0.5 w-full h-full justify-center rounded-md`,
        current ? tw`hover:bg-gray-100` : tw`hover:bg-gray-50`,
      ]}
    >
      <span
        css={[
          tw`w-6 h-6 mx-auto`,
          current
            ? tw`text-gray-500`
            : tw`text-gray-400 group-hover:text-gray-500`,
        ]}
      >
        {Icon}
      </span>
      <span
        css={[
          tw`text-xs font-medium`,
          current
            ? tw`text-gray-900`
            : tw`text-gray-600 group-hover:text-gray-900`,
        ]}
      >
        {label}
      </span>
    </Link>
  </li>
);
