import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { ReactNode, useMemo } from "react";

const badgeVariants = cva("relative inline-flex items-center rounded-full py-0.5 font-medium", {
  variants: {
    colour: {
      grey: "text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-white/10",
      orange: "text-orange-800 bg-orange-100 dark:text-orange-200 dark:bg-orange-500/15",
      blue: "text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-500/15",
      green: "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-500/15",
    },
    size: {
      small: "text-xs",
      large: "text-sm",
    },
    icon: {
      none: "",
      left: "",
      right: "",
    },
  },
  compoundVariants: [
    { size: "small", icon: "none", className: "px-2.5" },
    { size: "large", icon: "none", className: "px-3" },
    { size: "small", icon: "left", className: "pl-0.5 pr-2" },
    { size: "large", icon: "left", className: "pl-1 pr-2.5" },
    { size: "small", icon: "right", className: "pl-2 pr-0.5" },
    { size: "large", icon: "right", className: "pl-2.5 pr-1" },
  ],
  defaultVariants: {
    colour: "grey",
    size: "small",
    icon: "none",
  },
});

const iconButtonColour: Record<NonNullable<BadgeColour>, string> = {
  grey: "text-gray-400 bg-gray-100 hover:text-gray-500 hover:bg-gray-200 focus:bg-gray-500 focus:text-white dark:text-gray-300 dark:bg-white/10 dark:hover:bg-white/20 dark:hover:text-gray-200 dark:focus:bg-gray-300 dark:focus:text-gray-900",
  orange:
    "text-orange-400 bg-orange-100 hover:text-orange-500 hover:bg-orange-200 focus:bg-orange-500 focus:text-white dark:text-orange-300 dark:bg-orange-500/15 dark:hover:bg-orange-500/25 dark:hover:text-orange-200 dark:focus:bg-orange-400 dark:focus:text-gray-950",
  blue: "text-blue-400 bg-blue-100 hover:text-blue-500 hover:bg-blue-200 focus:bg-blue-500 focus:text-white dark:text-blue-300 dark:bg-blue-500/15 dark:hover:bg-blue-500/25 dark:hover:text-blue-200 dark:focus:bg-blue-400 dark:focus:text-gray-950",
  green:
    "text-green-400 bg-green-100 hover:text-green-500 hover:bg-green-200 focus:bg-green-500 focus:text-white dark:text-green-300 dark:bg-green-500/15 dark:hover:bg-green-500/25 dark:hover:text-green-200 dark:focus:bg-green-400 dark:focus:text-gray-950",
};

type BadgeColour = VariantProps<typeof badgeVariants>["colour"];

interface BadgeProps {
  label: string;
  colour?: BadgeColour;
  size?: "small" | "large";
  clickable?: boolean;

  /** Decorative leading element (flag, status dot, icon). Not interactive. */
  leadingIcon?: ReactNode;

  /** Interactive trailing/leading icon — e.g. a remove button on a tag. */
  icon?: {
    Element: ReactNode;
    position: "left" | "right";
    onClick?: () => void;
  };
}

export const Badge = ({
  label,
  icon,
  leadingIcon,
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
            "after:content after:block after:absolute after:h-full after:rounded-full after:aspect-square",
            clickable && "after:w-full",
            icon.position === "left" ? "mr-0.5 after:left-0" : "ml-0.5 after:right-0",
            iconButtonColour[colour ?? "grey"],
          ])}
        >
          <span className="w-2 h-2">{icon.Element}</span>
        </button>
      ) : null,
    [clickable, colour, icon],
  );

  return (
    <span className={badgeVariants({ colour, size, icon: icon?.position ?? "none" })}>
      {icon?.position === "left" && iconElement}

      {leadingIcon && (
        <span className="mr-1 inline-flex shrink-0 items-center">{leadingIcon}</span>
      )}

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
