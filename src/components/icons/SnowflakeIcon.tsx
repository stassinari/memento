import clsx from "clsx";

interface IconProps {
  className?: string;
}

export const SnowflakeIcon = ({ className }: IconProps) => (
  <svg
    className={clsx(className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2v20M4 6l16 12M20 6 4 18" />
  </svg>
);
