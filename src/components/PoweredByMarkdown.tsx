import React from "react";
import "twin.macro";

export const PoweredByMarkdown = () => (
  <React.Fragment>
    Powered by{" "}
    <a
      tw="underline hover:no-underline"
      href="https://www.markdownguide.org/"
      target="_blank"
      rel="noreferrer noopener"
    >
      Markdown
    </a>
  </React.Fragment>
);
