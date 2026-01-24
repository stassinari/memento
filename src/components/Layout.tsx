import clsx from "clsx";
import { ReactNode, Suspense } from "react";
import { BottomNav } from "./BottomNav";
import { ReloadPrompt } from "./ReloadPrompt";
import { SidebarNav } from "./SidebarNav";

// FIXME this is not ideal, look into TW custom utilities or any other way to handle this
export const layoutContainerTailwindStyles = "min-h-screen md:pb-0";

export const layoutContainerCssStyles = {
  paddingTop: "env(safe-area-inset-top)",
  paddingBottom: "calc(env(safe-area-inset-bottom) + 3.5rem)",
};

interface LayoutProps {
  fullWidth?: boolean;
  children: ReactNode;
}

export const Layout = ({ fullWidth = false, children }: LayoutProps) => {
  return (
    <div
      className={clsx(layoutContainerTailwindStyles)}
      style={layoutContainerCssStyles}
    >
      <SidebarNav />
      <div className="md:pl-48 lg:pl-64">
        <BottomNav />

        <main className={clsx("flex-1")}>
          <div className="py-6">
            <div
              className={clsx([
                "mx-auto",
                fullWidth
                  ? "px-4 sm:px-6 lg:px-8 2xl:px-12"
                  : "px-4 max-w-7xl sm:px-6 lg:px-16 2xl:px-32",
              ])}
            >
              <Suspense>{children}</Suspense>
              <ReloadPrompt />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
