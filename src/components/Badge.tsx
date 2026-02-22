import clsx from "clsx";
import { ReactNode, useMemo } from "react";

interface BadgeProps {
  label: string;
  colour?: "grey" | "orange";
  size?: "small" | "large";
  clickable?: boolean;

  icon?: {
    Element: ReactNode;
    position: "left" | "right";
    onClick?: () => void;
  };
}

export const Badge = ({
  label,
  icon,
  size = "small",
  clickable = false,
  colour = "grey",
}: BadgeProps) => {
  const iconElement = useMemo(
    () =>
      icon ? (
        <button
          type="button"
          onClick={icon.onClick}
          className={clsx([
            "inline-flex items-center justify-center shrink-0 w-4 h-4 rounded-full focus:outline-hidden",
            "after:content after:block after:absolute after:h-full after:rounded-full after:aspect-square", // see why this shouts
            clickable && "after:w-full",
            icon.position === "left"
              ? "mr-0.5 after:left-0"
              : icon.position === "right"
                ? "ml-0.5 after:right-0"
                : null,
            colour === "grey"
              ? "text-gray-400 bg-gray-100 hover:text-gray-500 hover:bg-gray-200 focus:bg-gray-500 focus:text-white"
              : colour === "orange"
                ? "text-orange-400 bg-orange-100 hover:text-orange-500 hover:bg-orange-200 focus:bg-orange-500 focus:text-white"
                : null,
          ])}
        >
          <span className="w-2 h-2">{icon.Element}</span>
        </button>
      ) : null,
    [clickable, colour, icon],
  );

  return (
    <span
      className={clsx([
        "relative inline-flex items-center rounded-full py-0.5 text-xs font-medium",
        size === "small" ? "px-2.5 text-xs" : size === "large" ? "px-3 text-sm" : null,
        colour === "grey"
          ? "text-gray-800 bg-gray-100"
          : colour === "orange"
            ? "text-orange-800 bg-orange-100"
            : null,
        icon
          ? icon.position === "left"
            ? size === "small"
              ? "pl-0.5 pr-2"
              : "pl-1 pr-2.5"
            : icon.position === "right"
              ? size === "small"
                ? "pl-2 pr-0.5"
                : "pl-2.5 pr-1"
              : null
          : "px-2.5",
      ])}
    >
      {icon?.position === "left" && iconElement}

      {label}

      {icon?.position === "right" && iconElement}
    </span>
  );
};

interface BadgeTimesIconProps {
  className?: string;
}

export const BadgeTimesIcon = ({ className }: BadgeTimesIconProps) => (
  <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 8 8">
    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
  </svg>
);

export const BadgePlusIcon = () => <BadgeTimesIcon className="transform rotate-45" />;
