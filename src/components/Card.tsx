import { type ReactNode } from "react";
import tw from "twin.macro";

interface CardProps {
  className?: string;
  children: ReactNode;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
}

const CardRoot: React.FC<CardProps> = ({
  children,
  className,
  headerSlot,
  footerSlot,
}) => (
  <div tw="overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow">
    {headerSlot && <div tw="px-4 py-5 sm:px-6">{headerSlot}</div>}
    <div tw="px-4 py-5 sm:p-6" className={className}>
      {children}
    </div>
    {footerSlot && <div tw="px-4 py-4 sm:px-6">{footerSlot}</div>}
  </div>
);

const Heading = tw.h3`text-base font-semibold leading-6 text-gray-900`;

export const Card = Object.assign(CardRoot, { Heading });
