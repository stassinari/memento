import "twin.macro";

interface DividerProps {
  className?: string;
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className }) => (
  <div tw="relative my-6" className={className} aria-hidden="true">
    <div tw="absolute inset-0 flex items-center">
      <div tw="w-full border-t border-gray-200" />
    </div>
    <div tw="relative flex justify-center text-sm">
      <span tw="px-2 text-gray-500 bg-white">{label}</span>
    </div>
  </div>
);
