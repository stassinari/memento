import React, { SVGProps } from "react";
import tw from "twin.macro";

interface ButtonProps {
  label: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const Button: React.FC<ButtonProps> = ({ label, size = "md", Icon }) => {
  return (
    <button
      type="button"
      css={[
        tw`inline-flex items-center font-medium text-white bg-indigo-600 border border-transparent shadow-sm`,
        tw`hover:bg-indigo-700 focus:(outline-none ring-2 ring-offset-2 ring-indigo-500)`,
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
      ]}
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
