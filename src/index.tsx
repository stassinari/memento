import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { FirebaseAppProvider } from "reactfire";
import { App } from "./components/App";
import firebaseConfig from "./firebaseConfig";
import { ErrorFallback } from "./pages/ErrorFallback";
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
    {/* Better errors LOL */}
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
        <GlobalStyles />
        <App />
      </FirebaseAppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
