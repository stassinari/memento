import React, { ReactNode } from "react";

interface TextOptionProps {
  text: string;
}

export const TextOption: React.FC<TextOptionProps> = ({ text }) => (
  <span tw="block truncate ui-selected:font-semibold">{text}</span>
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
    <span tw="ml-3 truncate ui-selected:font-semibold">{text}</span>
  </React.Fragment>
);
