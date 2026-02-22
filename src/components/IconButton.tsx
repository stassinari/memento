import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { baseButtonStyles, compoundButtonStyles } from "./Button";

const iconButtonStyles = [...baseButtonStyles, "rounded-full"];

const iconButtonVariants = cva(iconButtonStyles.join(" "), {
  variants: {
    variant: {
      primary: "",
      secondary: "",
      white: "text-gray-700 bg-white border-gray-300 shadow-xs hover:bg-gray-50",
      gradient: "",
    },
    colour: {
      main: "",
      accent: "",
    },
    size: {
      xs: "p-1 [&_span]:size-5",
      sm: "p-1.5 [&_span]:size-5",
      md: "p-2 [&_span]:size-5",
      lg: "p-2 [&_span]:size-6",
      xl: "p-3 [&_span]:size-6",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      colour: "main",
      className: compoundButtonStyles.primaryMain,
    },
    {
      variant: "secondary",
      colour: "main",
      className: compoundButtonStyles.secondaryMain,
    },
    {
      variant: "gradient",
      colour: "main",
      className: compoundButtonStyles.gradientMain,
    },
    {
      variant: "primary",
      colour: "accent",
      className: compoundButtonStyles.primaryAccent,
    },
    {
      variant: "secondary",
      colour: "accent",
      className: compoundButtonStyles.secondaryAccent,
    },
    {
      variant: "gradient",
      colour: "accent",
      className: compoundButtonStyles.gradientAccent,
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    colour: "main",
  },
});

type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>;

type IconButtonProps = {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
} & IconButtonVariantProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ asChild = false, variant, size, colour, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={clsx(iconButtonVariants({ variant, size, colour }), className)}
        ref={ref}
        {...props}
      >
        <span aria-hidden="true">{children}</span>
      </Comp>
    );
  },
);

IconButton.displayName = "IconButton";
