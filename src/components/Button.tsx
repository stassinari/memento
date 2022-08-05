import React from "react";
import tw from "twin.macro";

interface ButtonProps {
  label: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const Button: React.FC<ButtonProps> = ({ label, size = "md" }) => {
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
      {label}
    </button>
  );
};
