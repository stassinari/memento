import clsx from "clsx";

interface IconProps {
  className?: string;
}

export const BowlIcon = ({ className }: IconProps) => (
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
      d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.019.004-.015-.004-.071-.035q-.016-.005-.024.005l-.004.011-.017.427.005.02.011.013.103.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427q-.004-.016-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093q.019.005.029-.008l.004-.014-.034-.614q-.006-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014-.034.614a.023.023 0 0 0 .017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.009-.009z"
      style={{ fill: "none", fillRule: "nonzero" }}
    />
    <path d="M20.154 5C21.174 5 22 5.827 22 6.846V9a9 9 0 0 1-6 8.488V18.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 18.5v-1.012A9 9 0 0 1 2 9V6.846C2 5.827 2.827 5 3.846 5zM20 9V7H4v2a7 7 0 0 0 7 7h2a7 7 0 0 0 7-7" />
  </svg>
);
