import clsx from "clsx";
import React, { ReactNode } from "react";
import { Box, PolymorphicComponentProps } from "react-polymorphic-box";

// Component-specific props specified separately
export type ButtonOwnProps = {
  variant: "primary" | "secondary" | "white" | "gradient";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  colour?: "main" | "accent";
  width?: "auto" | "full";
  Icon?: ReactNode;
};

// Merge own props with others inherited from the underlying element type
export type ButtonProps<E extends React.ElementType> =
  PolymorphicComponentProps<E, ButtonOwnProps>;

const defaultElement = "button";

export const Button: <E extends React.ElementType = typeof defaultElement>(
  props: ButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      variant,
      colour = "main",
      size = "md",
      width = "auto",
      Icon,
      children,
      ...restProps
    }: ButtonProps<E>,
    ref: typeof restProps.ref,
  ) => (
    <Box
      as={defaultElement}
      className={clsx([
        "inline-flex items-center justify-center font-medium border",
        "disabled:cursor-not-allowed disabled:bg-gray-100! disabled:from-gray-100 disabled:text-gray-500! disabled:hover:from-gray-100",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        colour === "main"
          ? variant === "primary"
            ? "bg-orange-600 hover:bg-orange-700"
            : variant === "secondary"
              ? "text-orange-700 bg-orange-100 hover:bg-orange-200"
              : variant === "gradient"
                ? "bg-gradient-to-br from-orange-600 to-rose-600 bg-origin-border hover:from-orange-700 hover:to-rose-700"
                : null
          : colour === "accent"
            ? variant === "primary"
              ? "bg-blue-600 hover:bg-blue-700"
              : variant === "secondary"
                ? "text-blue-700 bg-blue-100 hover:bg-blue-200"
                : variant === "gradient"
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 bg-origin-border hover:from-blue-700 hover:to-purple-700"
                  : null
            : null,
        colour === "main"
          ? "ring-orange-500"
          : colour === "accent"
            ? "ring-blue-500"
            : null,
        variant === "primary" || variant === "gradient"
          ? "text-white border-transparent shadow-sm "
          : variant === "secondary"
            ? "border-transparent "
            : variant === "white"
              ? "text-gray-700 bg-white border-gray-300 shadow-sm hover:bg-gray-50"
              : null,
        size === "xs"
          ? "px-2.5 py-1.5 text-xs rounded"
          : size === "sm"
            ? "px-3 py-2 text-sm leading-4 rounded-md"
            : size === "md"
              ? "px-4 py-2 text-sm rounded-md"
              : size === "lg"
                ? "px-4 py-2 text-base rounded-md"
                : size === "xl"
                  ? "px-6 py-3 text-base rounded-md"
                  : null,
        width === "full" && "w-full",
      ])}
      ref={ref}
      {...restProps}
    >
      {Icon && (
        <span
          className={clsx([
            size === "xs" || size === "sm"
              ? "-ml-0.5 mr-2 h-4 w-4"
              : size === "md"
                ? "w-5 h-5 mr-2 -ml-1"
                : size === "lg" || size === "xl"
                  ? "w-5 h-5 mr-3 -ml-1"
                  : null,
          ])}
          aria-hidden="true"
        >
          {Icon}
        </span>
      )}
      {children}
    </Box>
  ),
);
