import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import tw from "twin.macro";

export const SimpleLayout2 = tw.div`flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8`;

export const SimpleLayout: React.FC = () => (
  <div tw="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
    <Suspense>
      <Outlet />
    </Suspense>
  </div>
);
