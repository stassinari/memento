import { css } from "@emotion/react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import tw from "twin.macro";
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";

export const layoutContainerStyles = [
  tw`min-h-screen md:pb-0`,
  css`
    padding-top: env(safe-area-inset-top);
    padding-bottom: calc(
      env(safe-area-inset-bottom) + 3.5rem // look into using proper TW value
    );
  `,
];

export const Layout = () => {
  return (
    <div css={layoutContainerStyles}>
      <SidebarNav />
      <div tw="md:pl-64">
        <BottomNav />

        <main css={tw`flex-1`}>
          <div tw="py-6">
            {/* <div tw="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              <h1 tw="text-2xl font-semibold text-gray-900">
                {"{Put title here!}"}
              </h1>
            </div> */}
            <div tw="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              {/* /End replace */}
              <Suspense fallback={<Fallback />}>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const Fallback = () => <div>Loading stuff</div>;
