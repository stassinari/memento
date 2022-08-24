import React, { ButtonHTMLAttributes, SVGProps } from "react";
import tw from "twin.macro";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant: "primary" | "secondary" | "white";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  width?: "auto" | "full";
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant,
  size = "md",
  width = "auto",
  Icon,
  ...rest
}) => {
  return (
    <button
      type="button"
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
      {...rest}
    >
      {Icon && (
        <Icon
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
        />
      )}
      {label}
    </button>
  );
};
