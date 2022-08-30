import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import "twin.macro";
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";

export const Layout = () => {
  return (
    <React.Fragment>
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
