import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import type { ReactNode } from "react";

interface TastingSamplesListProps {
  variant: "inbox" | "card";
  children: ReactNode;
}

export const TastingSamplesList = ({ variant, children }: TastingSamplesListProps) => {
  return <ul className={variant === "inbox" ? "space-y-1 p-2" : "space-y-2"}>{children}</ul>;
};

interface TastingSamplesListItemProps {
  asChild?: boolean;
  variant: "inbox" | "card";
  isSelected?: boolean;
  children: ReactNode;
}

export const TastingSamplesListItem = ({
  asChild = false,
  variant,
  isSelected = false,
  children,
}: TastingSamplesListItemProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <li>
      <Comp
        {...(!asChild ? { type: "button" as const } : {})}
        className={clsx(
          "block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
          variant === "inbox" &&
            (isSelected
              ? "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-400/60 dark:bg-orange-500/15 dark:text-orange-200"
              : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-white dark:text-gray-300 dark:hover:border-white/10 dark:hover:bg-white/5"),
          variant === "card" &&
            "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5",
        )}
      >
        {children}
      </Comp>
    </li>
  );
};

interface TastingSamplesListItemContentProps {
  sampleNumber: number;
  label: string;
}

export const TastingSamplesListItemContent = ({
  sampleNumber,
  label,
}: TastingSamplesListItemContentProps) => (
  <>
    <p className="font-semibold">Sample #{sampleNumber}</p>
    <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{label || "-"}</p>
  </>
);
