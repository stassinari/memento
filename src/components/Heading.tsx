import clsx from "clsx";
import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  actionSlot?: React.ReactNode;
  className?: string;
}

export const Heading = ({ children, actionSlot, className }: HeadingProps) => {
  return (
    <div className={clsx("flex items-center justify-between", className)}>
      <h1 className="text-2xl leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
        {children}
      </h1>
      {actionSlot && <>{actionSlot}</>}
    </div>
  );
};
