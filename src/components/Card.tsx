import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import { Action } from "./ButtonWithDropdown";

const Container = tw.div`overflow-hidden bg-white rounded-lg shadow`;

const Content = tw.div`px-4 py-4 sm:px-6`;

interface CardProps {
  className?: string;
  children: ReactNode;
}

const CardRoot: React.FC<CardProps> = ({ children, className }) => (
  <Container className={className}>
    <Content>{children}</Content>
  </Container>
);

interface HeaderProps {
  title: string;
  action?: Action;
}

const actionStyles = tw`font-medium text-sm text-orange-600 hover:(text-orange-500 underline)`;

const Header: React.FC<HeaderProps> = ({ title, action }) => (
  <div tw="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/50 sm:px-6">
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

const Footer = tw.div`px-4 py-2 border-t border-gray-100 bg-gray-50/50 sm:px-6`;

export interface DescriptionListRow {
  label: string;
  value: string | ReactNode;
}

interface DescriptionListProps {
  rows: DescriptionListRow[];
}

const DescriptionList: React.FC<DescriptionListProps> = ({ rows }) => (
  <div tw="divide-y divide-gray-100">
    {rows.map(({ label, value }) => (
      <dl
        key={label}
        tw="flex items-center justify-between py-1 gap-x-4 first-of-type:pt-0 last-of-type:pb-0 sm:py-2"
      >
        <dt tw="text-sm font-normal text-gray-500">{label}</dt>
        <dd tw="mt-1 text-sm font-medium text-gray-800 ">{value}</dd>
      </dl>
    ))}
  </div>
);

export const Card = Object.assign(CardRoot, {
  Header,
  Footer,
  DescriptionList,
  Container,
  Content,
});
