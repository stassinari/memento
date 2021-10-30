import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";

// import * as serviceWorker from "./serviceWorker";
// import swConfig from "./config/swConfig";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.querySelector("#root"));

// FIXME solve app not updating before re-enabling service workers
// serviceWorker.register(swConfig);
