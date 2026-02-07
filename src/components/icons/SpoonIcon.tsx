import { clsx } from "clsx";

interface IconProps {
  className?: string;
}

export const SpoonIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
    viewBox="0 0 24 24"
    className={clsx("fill-current", className)}
  >
    <path
      d="M28.4 3.6c-1.1-1.1-2.6-1.7-4.1-1.6-2.3.2-4.5 1.2-6.2 2.8-2.4 2.4-3.4 5.9-2.6 9.2L2.9 24.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.1c.5.6 1.3.9 2.1.9s1.6-.3 2.2-.9L18 16.5c.8.2 1.5.3 2.3.3 2.5 0 5-1 6.9-2.9 1.7-1.7 2.7-3.9 2.8-6.2.1-1.5-.5-3-1.6-4.1M5.7 27.7c-.4.4-1 .4-1.4 0-.2-.2-.3-.4-.3-.7s.1-.5.2-.7l10.1-8.7zm20-15.2c-2.1 2.1-5.1 2.8-7.9 1.9l-.2-.1-.1-.2c-.9-2.8-.2-5.8 1.9-7.9 1.3-1.3 3.1-2.1 4.9-2.3.9-.1 1.9.3 2.6 1s1 1.6 1 2.6c0 1.9-.8 3.7-2.2 5"
      style={{ fillRule: "nonzero" }}
      transform="translate(-.573 -.564)scale(.78554)"
    />
  </svg>
);
