import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import tw from "twin.macro";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

export const LayoutOld = () => {
  return (
    <div tw="container mx-auto sm:px-6 lg:px-8">
      <Header />

      <div tw="mt-16">
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: InboxIcon, current: false },
  { name: "Reports", href: "#", icon: ChartBarIcon, current: false },
];

export default function Layout() {
  return (
    <React.Fragment>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <div>
        {/* Static sidebar for desktop */}
        <div tw="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
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
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group"
                    css={[
                      tw`flex items-center px-2 py-2 text-sm font-medium rounded-md`,
                      item.current
                        ? tw`text-gray-900 bg-gray-100`
                        : tw`text-gray-600 hover:bg-gray-50 hover:text-gray-900`,
                    ]}
                  >
                    <item.icon
                      css={[
                        tw`flex-shrink-0 w-6 h-6 mr-3`,
                        item.current
                          ? tw`text-gray-500`
                          : tw`text-gray-400 group-hover:text-gray-500`,
                      ]}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            <div tw="flex flex-shrink-0 p-4 border-t border-gray-200">
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
            </div>
          </div>
        </div>
        <div tw="md:pl-64">
          <BottomNav />

          <main tw="flex-1">
            <div tw="py-6">
              <div tw="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                <h1 tw="text-2xl font-semibold text-gray-900">
                  {"{Put title here!}"}
                </h1>
              </div>
              <div tw="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                {/* /End replace */}
                <Suspense>
                  <Outlet />
                </Suspense>
              </div>
            </div>
          </main>
        </div>
      </div>
    </React.Fragment>
  );
}
