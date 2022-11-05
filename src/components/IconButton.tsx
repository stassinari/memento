import React, { ReactNode } from "react";
import { Box, PolymorphicComponentProps } from "react-polymorphic-box";
import tw from "twin.macro";

// Component-specific props specified separately
export type IconButtonOwnProps = {
  Icon: ReactNode;
  variant: "primary" | "secondary" | "white";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  colour?: "main" | "accent";
};

// Merge own props with others inherited from the underlying element type
export type IconButtonProps<E extends React.ElementType> =
  PolymorphicComponentProps<E, IconButtonOwnProps>;

const defaultElement = "button";

export const IconButton: <E extends React.ElementType = typeof defaultElement>(
  props: IconButtonProps<E>
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
    ref: typeof restProps.ref
  ) => (
    <Box
      as={defaultElement}
      className=""
      css={[
        tw`inline-flex items-center p-2 text-white border rounded-full`,
        tw`disabled:(cursor-not-allowed bg-gray-100! text-gray-500!)`,
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
          : null,
        colour === "main"
          ? tw`ring-orange-500`
          : colour === "accent"
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
          ? tw`p-1`
          : size === "sm"
          ? tw`p-1.5`
          : size === "md"
          ? tw`p-2`
          : size === "lg"
          ? tw`p-2`
          : size === "xl"
          ? tw`p-3`
          : null,
        width === "full" && tw`w-full`,
      ]}
      ref={ref}
      {...restProps}
    >
      <span
        css={[
          size === "xs" || size === "sm" || size === "md"
            ? tw`w-5 h-5`
            : size === "lg" || size === "xl"
            ? tw`w-6 h-6`
            : null,
        ]}
        aria-hidden="true"
      >
        {Icon}
      </span>
    </Box>
  )
);
