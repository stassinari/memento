import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { Provider } from "jotai";
import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { App } from "./App";
import { ErrorFallback } from "./components/ErrorFallback";
import "./styles/config.css";
import { GlobalStyles } from "./styles/GlobalStyles";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],

  // set to capture all transactions since it's such a small app
  tracesSampleRate: 1.0,
});

const container = document.querySelector("#root");
const root = createRoot(container!);

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
