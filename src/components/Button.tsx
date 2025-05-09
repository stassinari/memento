import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import React, { forwardRef } from "react";

import { cva, type VariantProps } from "class-variance-authority";

export const baseButtonStyles = [
  "inline-flex items-center justify-center font-medium border",
  "focus:outline-hidden focus:ring-2 focus:ring-offset-2", // focus
  "disabled:cursor-not-allowed disabled:bg-gray-100! disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-500! disabled:hover:from-gray-100", // disabled
  "[&_svg]:pointer-events-none [&_svg]:shrink-0", // svg icons handling
];

export const compoundButtonStyles = {
  primaryMain:
    "bg-orange-600 hover:bg-orange-700 text-white border-transparent shadow-xs ring-orange-500",
  secondaryMain:
    "text-orange-700 bg-orange-100 hover:bg-orange-200 border-transparent ring-orange-500",
  gradientMain:
    "bg-linear-to-br from-orange-600 to-rose-600 bg-origin-border hover:from-orange-700 hover:to-rose-700 text-white border-transparent shadow-xs ring-orange-500",
  primaryAccent:
    "bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-xs ring-blue-500",
  secondaryAccent:
    "text-blue-700 bg-blue-100 hover:bg-blue-200 border-transparent ring-blue-500",
  gradientAccent:
    "bg-linear-to-br from-blue-600 to-purple-600 bg-origin-border hover:from-blue-700 hover:to-purple-700 text-white border-transparent shadow-xs ring-blue-500",
};

const buttonVariants = cva(baseButtonStyles.join(" "), {
  variants: {
    variant: {
      primary: "",
      secondary: "",
      white:
        "text-gray-700 bg-white border-gray-300 shadow-xs hover:bg-gray-50",
      gradient: "",
    },
    colour: {
      main: "",
      accent: "",
    },
    size: {
      xs: "px-2.5 py-1.5 text-xs rounded-sm gap-2 [&_svg]:size-4 has-[>svg]:px-2",
      sm: "px-3 py-2 text-sm leading-4 rounded-md gap-2 [&_svg]:size-4 has-[>svg]:px-2.5",
      md: "px-4 py-2 text-sm rounded-md gap-2 [&_svg]:size-5 has-[>svg]:px-3",
      lg: "px-4 py-2 text-base rounded-md gap-3 [&_svg]:size-5 has-[>svg]:px-3",
      xl: "px-6 py-3 text-base rounded-md gap-3 [&_svg]:size-5 has-[>svg]:px-4",
    },
    width: {
      auto: "",
      full: "w-full",
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
    width: "auto",
  },
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
} & ButtonVariantProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      variant,
      size,
      colour,
      width,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={clsx(
          buttonVariants({ variant, size, colour, width }),
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";
