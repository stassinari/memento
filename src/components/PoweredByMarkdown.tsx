import React from "react";
import "twin.macro";

export const PoweredByMarkdown: React.FC = () => (
  <>
    Powered by{" "}
    <a
      tw="underline hover:no-underline"
      href="https://www.markdownguide.org/"
      target="_blank"
      rel="noreferrer noopener"
    >
      Markdown
    </a>
  </>
);
