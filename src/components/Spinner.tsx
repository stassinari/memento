import clsx from "clsx";

export const Spinner = () => (
  <div
    className={clsx([
      "w-8 h-8 border-4 border-orange-400 rounded-full animate-spin border-t-transparent",
    ])}
  />
);
