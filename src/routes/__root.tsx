/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { Provider as JotaiProvider } from "jotai";
import React, { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "~/components/ErrorFallback";
import { NotFound } from "~/components/ErrorPage";
import { NotificationContainer } from "~/components/NotificationContainer";
// import { FeatureFlagsProvider } from "~/hooks/useFeatureFlag";
import { useInitUser } from "~/hooks/useInitUser";
import "~/styles/config.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
    },
  },
});

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
      </body>
    </html>
  );
}

const RootComponent = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {/* <FeatureFlagsProvider> */}
          <JotaiProvider>
            <RootDocument>
              <Suspense fallback={<div>Initializing...</div>}>
                <NotificationContainer />
                <Outlet />
              </Suspense>
            </RootDocument>
          </JotaiProvider>
          {/* </FeatureFlagsProvider> */}
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// This must come AFTER the components it references
export const Route = createRootRoute({
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
