import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],

  // set to capture all transactions since it's such a small app
  tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.querySelector("#root"));
