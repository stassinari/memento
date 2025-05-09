import clsx from "clsx";
import { HTMLAttributes, Suspense } from "react";
import { Outlet } from "react-router-dom";

export const SimpleLayout2 = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <SimpleLayout2
    className={clsx(
      "flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8",
      className,
    )}
    {...props}
  />
);

export const SimpleLayout = () => (
  <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
    <Suspense>
      <Outlet />
    </Suspense>
  </div>
);
