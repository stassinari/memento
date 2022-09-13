import { ReactNode } from "react";
import "twin.macro";
import tw from "twin.macro";

interface BadgeProps {
  label: string;
  onClick?: () => void;
  ButtonIcon?: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  onClick,
  ButtonIcon = <TimesIcon />,
}) => {
  return (
    <span
      css={[
        tw`inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800`,
        onClick ? tw`pl-2 pr-0.5` : tw`px-2.5`,
      ]}
    >
      {label}

      {onClick && (
        <button
          type="button"
          onClick={onClick}
          tw="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-orange-400 hover:bg-orange-200 hover:text-orange-500 focus:bg-orange-500 focus:text-white focus:outline-none"
        >
          {/* <span tw="sr-only">Remove small option</span> */}
          {ButtonIcon}
        </button>
      )}
    </span>
  );
};

const TimesIcon = () => (
  <svg tw="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
  </svg>
);
