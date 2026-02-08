/// <reference types="vite/client" />
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Provider as JotaiProvider } from "jotai";
import React, { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "~/components/ErrorFallback";
import { NotFound } from "~/components/ErrorPage";
import { NotificationContainer } from "~/components/NotificationContainer";
import { FeatureFlagsProvider } from "~/hooks/useFeatureFlag";
import { useInitUser } from "~/hooks/useInitUser";
import { RouterContext } from "~/router";
import "~/styles/config.css";

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  // Initialize auth state listener (client-side only, non-blocking)
  useInitUser();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" && (
          <>
            <TanStackRouterDevtools position="top-right" />
            <ReactQueryDevtools buttonPosition="bottom-right" />
          </>
        )}
      </body>
    </html>
  );
}

const RootComponent = () => {
  const routerState = useRouterState();
  const queryClient = routerState.matches[0]?.context.queryClient;

  if (!queryClient) {
    return <div>Loading...</div>;
  }

  return (
    <React.StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <FeatureFlagsProvider>
              <RootDocument>
                <Suspense fallback={<div>Initializing...</div>}>
                  <NotificationContainer />
                  <Outlet />
                </Suspense>
              </RootDocument>
            </FeatureFlagsProvider>
          </JotaiProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// This must come AFTER the components it references
export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    title: "Memento Coffee",
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "minimum-scale=1, maximum-scale=1, initial-scale=1, width=device-width, viewport-fit=cover",
      },
      { name: "theme-color", content: "#f9fafb" },
      {
        name: "description",
        content: "Memento helps you keep track of everything coffee.",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
      { rel: "mask-icon", href: "/favicon.svg", color: "#FFFFFF" },
      { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});
