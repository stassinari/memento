import tw from "twin.macro";

interface DividerProps {
  className?: string;
  label?: string;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl"; // this is improvised, not TailwindUI
}

export const Divider: React.FC<DividerProps> = ({
  label,
  className,
  spacing = "lg",
}) => (
  <div
    css={[
      tw`relative`,
      spacing === "xs"
        ? tw`my-2`
        : spacing === "sm"
        ? tw`my-3`
        : spacing === "md"
        ? tw`my-4`
        : spacing === "lg"
        ? tw`my-6`
        : spacing === "xl"
        ? tw`my-8`
        : null,
    ]}
    className={className}
    aria-hidden="true"
  >
    <div tw="absolute inset-0 flex items-center">
      <div tw="w-full border-t border-gray-200" />
    </div>
    <div tw="relative flex justify-center text-sm">
      <span tw="px-2 text-gray-500 bg-white">{label}</span>
    </div>
  </div>
);
