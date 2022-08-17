import "twin.macro";

interface DividerProps {
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({ label }) => (
  <div tw="relative my-6">
    <div tw="absolute inset-0 flex items-center">
      <div tw="w-full border-t border-gray-300" />
    </div>
    <div tw="relative flex justify-center text-sm">
      <span tw="px-2 text-gray-500 bg-white">{label}</span>
    </div>
  </div>
);
