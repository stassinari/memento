import React, { ReactNode } from "react";

interface TextOptionProps {
  text: string;
}

export const TextOption = ({ text }: TextOptionProps) => (
  <span className="block truncate ui-selected:font-semibold">{text}</span>
);

interface TextWithImageOptionProps {
  Image: ReactNode;
  text: string;
}

export const TextWithImageOption = ({ Image, text }: TextWithImageOptionProps) => (
  <>
    <div className="shrink-0 w-6 overflow-hidden rounded-sm">{Image}</div>
    <span className="ml-3 truncate ui-selected:font-semibold">{text}</span>
  </>
);
