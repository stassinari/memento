import * as Sentry from "@sentry/react";
import { Provider } from "jotai";
import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { App } from "./App";
import { ErrorFallback } from "./components/ErrorFallback";
import { GlobalStyles } from "./styles/GlobalStyles";
import "./styles/config.css";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],

  // set to capture all transactions since it's such a small app
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const container = document.querySelector("#root");
const root = createRoot(container as Element);

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <GlobalStyles />
      <Provider>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
