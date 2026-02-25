import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import React, { forwardRef } from "react";

type LinkProps = {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const linkStyles =
  "text-orange-600 underline hover:text-orange-500 hover:no-underline dark:text-orange-300 dark:hover:text-orange-200";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp className={clsx(linkStyles, className)} ref={ref} {...props}>
        {children}
      </Comp>
    );
  },
);

Link.displayName = "Link";
