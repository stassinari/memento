import clsx from "clsx";
import React, { ReactNode } from "react";
import { Box, PolymorphicComponentProps } from "react-polymorphic-box";

// Component-specific props specified separately
export type IconButtonOwnProps = {
  Icon: ReactNode;
  variant: "primary" | "secondary" | "white" | "gradient";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  colour?: "main" | "accent";
};

// Merge own props with others inherited from the underlying element type
export type IconButtonProps<E extends React.ElementType> =
  PolymorphicComponentProps<E, IconButtonOwnProps>;

const defaultElement = "button";

export const IconButton: <E extends React.ElementType = typeof defaultElement>(
  props: IconButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      Icon,
      variant,
      colour = "main",
      size = "md",
      width = "auto",
      children,
      ...restProps
    }: IconButtonProps<E>,
    ref: typeof restProps.ref,
  ) => (
    <Box
      as={defaultElement}
      className={clsx([
        "inline-flex items-center p-2 text-white border rounded-full",
        "disabled:cursor-not-allowed disabled:bg-gray-100! disabled:from-gray-100 disabled:text-gray-500! disabled:hover:from-gray-100",
        "focus:outline-hidden focus:ring-2 focus:ring-offset-2",
        colour === "main"
          ? variant === "primary"
            ? "bg-orange-600 hover:bg-orange-700"
            : variant === "secondary"
              ? "text-orange-700 bg-orange-100 hover:bg-orange-200"
              : variant === "gradient"
                ? "bg-linear-to-br from-orange-600 to-rose-600 bg-origin-border hover:from-orange-700 hover:to-rose-700"
                : null
          : colour === "accent"
            ? variant === "primary"
              ? "bg-blue-600 hover:bg-blue-700"
              : variant === "secondary"
                ? "text-blue-700 bg-blue-100 hover:bg-blue-200"
                : variant === "gradient"
                  ? "bg-linear-to-br from-blue-600 to-purple-600 bg-origin-border hover:from-blue-700 hover:to-purple-700"
                  : null
            : null,
        colour === "main"
          ? "ring-orange-500"
          : colour === "accent"
            ? "ring-blue-500"
            : null,
        variant === "primary" || variant === "gradient"
          ? "text-white border-transparent shadow-xs "
          : variant === "secondary"
            ? "border-transparent "
            : variant === "white"
              ? "text-gray-700 bg-white border-gray-300 shadow-xs hover:bg-gray-50"
              : null,
        size === "xs"
          ? "p-1"
          : size === "sm"
            ? "p-1.5"
            : size === "md"
              ? "p-2"
              : size === "lg"
                ? "p-2"
                : size === "xl"
                  ? "p-3"
                  : null,
        width === "full" && "w-full",
      ])}
      ref={ref}
      {...restProps}
    >
      <span
        className={clsx([
          size === "xs" || size === "sm" || size === "md"
            ? "w-5 h-5"
            : size === "lg" || size === "xl"
              ? "w-6 h-6"
              : null,
        ])}
        aria-hidden="true"
      >
        {Icon}
      </span>
    </Box>
  ),
);
