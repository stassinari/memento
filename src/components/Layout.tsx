import { css } from "@emotion/react";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import tw from "twin.macro";
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";

export const Layout = () => {
  return (
    <React.Fragment>
      <div tw="min-h-screen">
        <SidebarNav />
        <div tw="md:pl-64">
          <BottomNav />

          <main
            css={[
              tw`flex-1 md:pb-0`,
              css`
                padding-bottom: calc(env(safe-area-inset-bottom) + 3.5rem);
              `,
            ]}
          >
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
