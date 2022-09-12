import React, { ReactNode } from "react";

interface TextOptionProps {
  text: string;
}

export const TextOption: React.FC<TextOptionProps> = ({ text }) => (
  <span className="ui-selected:font-semibold" tw="block truncate">
    {text}
  </span>
);

interface TextWithImageOptionProps {
  Image: ReactNode;
  text: string;
}

export const TextWithImageOption: React.FC<TextWithImageOptionProps> = ({
  Image,
  text,
}) => (
  <React.Fragment>
    <div tw="flex-shrink-0 w-6 overflow-hidden rounded">{Image}</div>
    <span className="ui-selected:font-semibold" tw="ml-3 truncate">
      {text}
    </span>
  </React.Fragment>
);
