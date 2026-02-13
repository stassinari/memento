import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { HTMLAttributes, type ReactNode } from "react";
import { Action } from "./ButtonWithDropdown";

const Container = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx("overflow-hidden bg-white rounded-lg shadow-sm", className)}
    {...props}
  />
);

const Content = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("px-4 py-4 sm:px-6", className)} {...props} />
);

interface CardProps {
  className?: string;
  children: ReactNode;
}

const CardRoot = ({ children, className }: CardProps) => (
  <Container className={className}>
    <Content>{children}</Content>
  </Container>
);

interface HeaderProps {
  title: string;
  action?: Action;
}

const actionStyles =
  "font-medium text-sm text-orange-600 hover:text-orange-500 hover:underline";

const Header = ({ title, action }: HeaderProps) => (
  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/50 sm:px-6">
    <h3 className="text-sm font-bold leading-6 text-gray-900">{title}</h3>
    {action &&
      (action.type === "link" ? (
        <Link {...action.linkProps} className={clsx(actionStyles)}>
          {action.label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={action.onClick}
          className={clsx(actionStyles)}
        >
          {action.label}
        </button>
      ))}
  </div>
);

const Footer = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "px-4 py-2 border-t border-gray-100 bg-gray-50/50 sm:px-6",
      className,
    )}
    {...props}
  />
);

export interface DescriptionListRow {
  label: string;
  value: string | ReactNode;
}

interface DescriptionListProps {
  rows: DescriptionListRow[];
}

const DescriptionList = ({ rows }: DescriptionListProps) => (
  <div className="divide-y divide-gray-100">
    {rows.map(({ label, value }) => (
      <dl
        key={label}
        className="flex items-center justify-between py-1 gap-x-4 first-of-type:pt-0 last-of-type:pb-0 sm:py-2"
      >
        <dt className="text-sm font-normal text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-gray-800 ">{value}</dd>
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
