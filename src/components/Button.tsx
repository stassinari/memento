import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { Box, PolymorphicComponentProps } from "react-polymorphic-box";
import tw from "twin.macro";

interface ButtonOldProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant: "primary" | "secondary" | "white";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  width?: "auto" | "full";
  Icon?: ReactNode;
}

// Component-specific props specified separately
export type ButtonOwnProps = {
  variant: "primary" | "secondary" | "white";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
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
        tw`focus:(outline-none ring-2 ring-offset-2 ring-orange-500)`,
        variant === "primary"
          ? tw`text-white bg-orange-600 border-transparent shadow-sm hover:bg-orange-700`
          : variant === "secondary"
          ? tw`text-orange-700 bg-orange-100 border-transparent hover:bg-orange-200`
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
