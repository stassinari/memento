import React, { ReactNode } from "react";
import { Box, PolymorphicComponentProps } from "react-polymorphic-box";
import tw from "twin.macro";

// Component-specific props specified separately
export type ButtonOwnProps = {
  variant: "primary" | "secondary" | "white";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  colour?: "main" | "accent" | "mainGradient" | "accentGradient";
  width?: "auto" | "full";
  Icon?: ReactNode;
};

// Merge own props with others inherited from the underlying element type
export type ButtonProps<E extends React.ElementType> =
  PolymorphicComponentProps<E, ButtonOwnProps>;

const defaultElement = "button";

export const Button: <E extends React.ElementType = typeof defaultElement>(
  props: ButtonProps<E>
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
    ref: typeof restProps.ref
  ) => (
    <Box
      as={defaultElement}
      css={[
        tw`inline-flex items-center justify-center font-medium border`,
        tw`disabled:(cursor-not-allowed bg-gray-100! from-gray-100 text-gray-500! hover:from-gray-100)`,
        tw`focus:(outline-none ring-2 ring-offset-2)`,
        colour === "main"
          ? variant === "primary"
            ? tw`bg-orange-600 hover:bg-orange-700`
            : variant === "secondary"
            ? tw`text-orange-700 bg-orange-100 hover:bg-orange-200`
            : null
          : colour === "accent"
          ? variant === "primary"
            ? tw`bg-blue-600 hover:bg-blue-700`
            : variant === "secondary"
            ? tw`text-blue-700 bg-blue-100 hover:bg-blue-200`
            : null
          : colour === "mainGradient"
          ? variant === "primary"
            ? tw`bg-gradient-to-br from-orange-600 to-rose-600 bg-origin-border hover:(from-orange-700 to-rose-700)`
            : variant === "secondary"
            ? tw`text-orange-700 bg-orange-100 hover:bg-orange-200`
            : null
          : colour === "accentGradient"
          ? variant === "primary"
            ? tw`bg-gradient-to-br from-blue-600 to-purple-600 bg-origin-border hover:(from-blue-700 to-purple-700)`
            : variant === "secondary"
            ? tw`text-blue-700 bg-blue-100 hover:bg-blue-200`
            : null
          : null,
        colour === "main" || colour === "mainGradient"
          ? tw`ring-orange-500`
          : colour === "accent" || colour === "accentGradient"
          ? tw`ring-blue-500`
          : null,
        variant === "primary"
          ? tw`text-white border-transparent shadow-sm `
          : variant === "secondary"
          ? tw`border-transparent `
          : variant === "white"
          ? tw`text-gray-700 bg-white border-gray-300 shadow-sm hover:bg-gray-50`
          : null,
        size === "xs"
          ? tw`px-2.5 py-1.5 text-xs rounded`
          : size === "sm"
          ? tw`px-3 py-2 text-sm leading-4 rounded-md`
          : size === "md"
          ? tw`px-4 py-2 text-sm rounded-md`
          : size === "lg"
          ? tw`px-4 py-2 text-base rounded-md`
          : size === "xl"
          ? tw`px-6 py-3 text-base rounded-md`
          : null,
        width === "full" && tw`w-full`,
      ]}
      ref={ref}
      {...restProps}
    >
      {Icon && (
        <span
          css={[
            size === "xs" || size === "sm"
              ? tw`-ml-0.5 mr-2 h-4 w-4`
              : size === "md"
              ? tw`w-5 h-5 mr-2 -ml-1`
              : size === "lg" || size === "xl"
              ? tw`w-5 h-5 mr-3 -ml-1`
              : null,
          ]}
          aria-hidden="true"
        >
          {Icon}
        </span>
      )}
      {children}
    </Box>
  )
);
