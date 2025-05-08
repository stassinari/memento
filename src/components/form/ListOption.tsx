import React, { ReactNode } from "react";

interface TextOptionProps {
  text: string;
}

export const TextOption: React.FC<TextOptionProps> = ({ text }) => (
  <span className="block truncate ui-selected:font-semibold">{text}</span>
);

interface TextWithImageOptionProps {
  Image: ReactNode;
  text: string;
}

export const TextWithImageOption: React.FC<TextWithImageOptionProps> = ({
  Image,
  text,
}) => (
  <>
    <div className="flex-shrink-0 w-6 overflow-hidden rounded">{Image}</div>
    <span className="ml-3 truncate ui-selected:font-semibold">{text}</span>
  </>
);
