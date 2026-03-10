import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

const listVariants = cva("", {
  variants: {
    variant: {
      inbox: "space-y-1 p-2",
      card: "space-y-2",
    },
  },
});

const itemVariants = cva("block w-full rounded-md px-3 py-2 text-left text-sm transition-colors", {
  variants: {
    variant: {
      inbox: "",
      card: "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5",
    },
    isSelected: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "inbox",
      isSelected: true,
      className:
        "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/15 dark:text-orange-200 dark:ring-orange-400/40",
    },
    {
      variant: "inbox",
      isSelected: false,
      className:
        "text-gray-700 ring-1 ring-inset ring-transparent hover:bg-white dark:text-gray-300 dark:hover:bg-white/5",
    },
  ],
  defaultVariants: {
    isSelected: false,
  },
});

interface TastingSamplesListProps {
  variant: "inbox" | "card";
  children: ReactNode;
}

export const TastingSamplesList = ({ variant, children }: TastingSamplesListProps) => {
  return <ul className={listVariants({ variant })}>{children}</ul>;
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
        className={itemVariants({ variant, isSelected })}
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
