import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import "twin.macro";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { SidebarNav } from "./SidebarNav";

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

export const Layout = () => {
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
        <SidebarNav />
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
};
