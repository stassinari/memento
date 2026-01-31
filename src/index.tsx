import * as Sentry from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { App } from "./App";
import { ErrorFallback } from "./components/ErrorFallback";
import { FeatureFlagsProvider } from "./hooks/useFeatureFlag";
import "./instrument";
import "./styles/config.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TODO validate these are sensible defaults and are needed
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    },
  },
});

const container = document.querySelector("#root");
const root = createRoot(container as Element, {
  // Callback called when an error is thrown and not caught by an ErrorBoundary.
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn("Uncaught error", error, errorInfo.componentStack);
  }),
  // Callback called when React catches an error in an ErrorBoundary.
  onCaughtError: Sentry.reactErrorHandler(),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <FeatureFlagsProvider>
          <Provider>
            <App />
          </Provider>
        </FeatureFlagsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
