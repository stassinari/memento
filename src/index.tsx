import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],

  // set to capture all transactions since it's such a small app
  tracesSampleRate: 1.0,
});

const container = document.querySelector("#root");
const root = createRoot(container!);

root.render(<App />);
