import { clsx } from "clsx";

interface IconProps {
  className?: string;
}

export const DrinkIcon = ({ className }: IconProps) => (
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
    <g transform="translate(1.97 1.97)scale(.03918)">
      <path
        d="M454.513 74.938h-68.399V18.732C386.114 8.387 377.727 0 367.382 0H144.617c-10.345 0-18.732 8.387-18.732 18.732v56.206H57.486c-10.345 0-18.732 8.387-18.732 18.732v74.938c0 10.345 8.387 18.732 18.732 18.732h34.746c17.118 192.079 8.048 90.542 27.392 307.591.862 9.663 8.957 17.068 18.658 17.068h235.436c9.702 0 17.796-7.406 18.657-17.068 18.423-206.706 11.416-128.341 27.391-307.591h34.747c10.345 0 18.732-8.387 18.732-18.732V93.67c0-10.345-8.387-18.732-18.732-18.732M163.349 37.463h185.3v37.475h-185.3zm193.232 437.074H155.418l-4.898-55h210.963zm8.237-92.464H147.184c-5.874-65.962-3.801-42.676-9.104-102.271h235.836zm12.434-139.735h-242.51l-4.898-54.999h252.31zm58.529-92.462H76.217v-37.475h359.564z"
        style={{ fillRule: "nonzero" }}
      />
      <circle cx="255.999" cy="330.939" r="28.909" />
    </g>
  </svg>
);
