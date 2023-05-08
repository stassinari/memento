import { ReactNode, useMemo } from "react";
import tw from "twin.macro";

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

export const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  size = "small",
  clickable = false,
  colour = "grey",
}) => {
  const iconElement = useMemo(
    () =>
      icon ? (
        <button
          type="button"
          onClick={icon.onClick}
          css={[
            tw`inline-flex items-center justify-center flex-shrink-0 w-4 h-4 rounded-full focus:outline-none`,
            tw`after:(content block absolute h-full rounded-full aspect-square)`, // see why this shouts
            clickable && tw`after:w-full`,
            icon.position === "left"
              ? tw`mr-0.5 after:left-0`
              : icon.position === "right"
              ? tw`ml-0.5 after:right-0`
              : null,
            colour === "grey"
              ? tw`text-gray-400 bg-gray-100 hover:(text-gray-500 bg-gray-200) focus:(bg-gray-500 text-white)`
              : colour === "orange"
              ? tw`text-orange-400 bg-orange-100 hover:(text-orange-500 bg-orange-200) focus:(bg-orange-500 text-white)`
              : null,
          ]}
        >
          <span tw="w-2 h-2">{icon.Element}</span>
        </button>
      ) : null,
    [clickable, colour, icon]
  );

  return (
    <span
      css={[
        tw`relative inline-flex items-center rounded-full py-0.5 text-xs font-medium`,
        size === "small"
          ? tw`px-2.5 text-xs`
          : size === "large"
          ? tw`px-3 text-sm`
          : null,
        colour === "grey"
          ? tw`text-gray-800 bg-gray-100`
          : colour === "orange"
          ? tw`text-orange-800 bg-orange-100`
          : null,
        icon
          ? icon.position === "left"
            ? size === "small"
              ? tw`pl-0.5 pr-2`
              : tw`pl-1 pr-2.5`
            : icon.position === "right"
            ? size === "small"
              ? tw`pl-2 pr-0.5`
              : tw`pl-2.5 pr-1`
            : null
          : tw`px-2.5`,
      ]}
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
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    viewBox="0 0 8 8"
  >
    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
  </svg>
);

export const BadgePlusIcon = () => <BadgeTimesIcon tw="transform rotate-45" />;
