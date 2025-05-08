import clsx from "clsx";
import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  actionSlot?: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  actionSlot,
  className,
}) => {
  return (
    <div className={clsx("flex items-center justify-between", className)}>
      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {children}
      </h1>
      {actionSlot && <>{actionSlot}</>}
    </div>
  );
};
