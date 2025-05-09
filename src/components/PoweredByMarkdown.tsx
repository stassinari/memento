import React from "react";

export const PoweredByMarkdown: React.FC = () => (
  <>
    Powered by{" "}
    <a
      className="underline hover:no-underline"
      href="https://www.markdownguide.org/"
      target="_blank"
      rel="noreferrer noopener"
    >
      Markdown
    </a>
  </>
);
