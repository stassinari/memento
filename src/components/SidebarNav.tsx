import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { Link, useLocation } from "react-router-dom";
import tw from "twin.macro";
import { BottomNavItemProps, navigation } from "./BottomNav";

const navigationOg = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: InboxIcon, current: false },
  { name: "Reports", href: "#", icon: ChartBarIcon, current: false },
];

const SidebarNavItem: React.FC<BottomNavItemProps> = ({
  Icon,
  label,
  linkTo,
  nested,
}) => {
  const { pathname } = useLocation();
  const isActive = pathname === linkTo;

  return (
    <Link
      to={linkTo}
      className="group"
      css={[
        tw`flex items-center px-2 py-2 text-sm font-medium rounded-md`,
        nested && tw`ml-4`,
        isActive
          ? tw`text-gray-900 bg-gray-100`
          : tw`text-gray-600 hover:bg-gray-50 hover:text-gray-900`,
      ]}
    >
      <span
        css={[
          tw`flex-shrink-0 w-6 h-6 mr-3`,
          isActive
            ? tw`text-gray-500`
            : tw`text-gray-400 group-hover:text-gray-500`,
        ]}
        aria-hidden="true"
      >
        {Icon}
      </span>
      {label}
    </Link>
  );
};

export const SidebarNav = () => {
  return (
    <div tw="hidden md:flex md:(w-64 flex-col fixed inset-y-0)">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div tw="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
        <div tw="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div tw="flex items-center flex-shrink-0 px-4">
            <img
              tw="w-auto h-8"
              src="https://tailwindui.com/img/logos/workflow-mark.svg?color=orange&shade=600"
              alt="Workflow"
            />
          </div>
          <nav tw="flex-1 px-2 mt-5 space-y-1 bg-white">
            {navigation.map(({ Icon, label, linkTo, nested }) => (
              <SidebarNavItem
                key={label}
                Icon={Icon}
                label={label}
                linkTo={linkTo}
                nested={nested}
              />
            ))}
          </nav>
        </div>
        {/* <div tw="flex flex-shrink-0 p-4 border-t border-gray-200">
          <a href="#" className="group" tw="flex-shrink-0 block w-full">
            <div tw="flex items-center">
              <div>
                <img
                  tw="inline-block rounded-full h-9 w-9"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div tw="ml-3">
                <p tw="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Tom Cook
                </p>
                <p tw="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  View profile
                </p>
              </div>
            </div>
          </a>
        </div> */}
      </div>
    </div>
  );
};
