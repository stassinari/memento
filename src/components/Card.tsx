import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import { Action } from "./ButtonWithDropdown";

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
  <div
    tw="overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow"
    className={className}
  >
    {headerSlot && <div tw="px-4 py-4 sm:px-6">{headerSlot}</div>}
    <div tw="px-4 py-4 sm:p-6">{children}</div>
    {footerSlot && <div tw="px-4 py-4 sm:px-6">{footerSlot}</div>}
  </div>
);

interface HeaderProps {
  title: string;
  action?: Action;
}

const actionStyles = tw`font-medium text-sm text-orange-600 hover:(text-orange-500 underline)`;

const Header: React.FC<HeaderProps> = ({ title, action }) => (
  <div tw="flex justify-between mb-3">
    <h3 tw="text-sm font-bold leading-6 text-gray-900">{title}</h3>
    {action &&
      (action.type === "link" ? (
        <Link to={action.href} css={actionStyles}>
          {action.label}
        </Link>
      ) : (
        <button type="button" onClick={action.onClick} css={actionStyles}>
          {action.label}
        </button>
      ))}
  </div>
);

interface DescriptionListRowProps {
  label: string;
  value: string | ReactNode;
}

interface DescriptionListProps {
  rows: DescriptionListRowProps[];
}

const DescriptionList: React.FC<DescriptionListProps> = ({ rows }) => (
  <div tw="divide-y divide-gray-100">
    {rows.map(({ label, value }) => (
      <dl
        key={label}
        tw="flex items-center justify-between py-1 gap-x-4 first-of-type:pt-0 last-of-type:pb-0"
      >
        <dt tw="text-sm font-normal text-gray-500">{label}</dt>
        <dd tw="mt-1 text-sm font-medium text-gray-800 ">{value}</dd>
      </dl>
    ))}
  </div>
);

export const Card = Object.assign(CardRoot, { Header, DescriptionList });
