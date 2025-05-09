import clsx from "clsx";

interface DividerProps {
  className?: string;
  label?: string;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl"; // this is improvised, not TailwindUI
}

export const Divider = ({ label, className, spacing = "lg" }: DividerProps) => (
  <div
    className={clsx([
      "relative",
      spacing === "xs"
        ? "my-2"
        : spacing === "sm"
          ? "my-3"
          : spacing === "md"
            ? "my-4"
            : spacing === "lg"
              ? "my-6"
              : spacing === "xl"
                ? "my-8"
                : null,
      className,
    ])}
    aria-hidden="true"
  >
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-200" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 text-gray-500 bg-white">{label}</span>
    </div>
  </div>
);
