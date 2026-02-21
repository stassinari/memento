import { LinkProps, Link as RouterLink } from "@tanstack/react-router";
import clsx from "clsx";
import { HTMLAttributes, ReactNode } from "react";
import { Card } from "./Card";

type FooterProps = {
  Icon?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Footer = ({ Icon, children, className }: FooterProps) => (
  <Card.Footer
    className={clsx(
      "flex items-center h-8 gap-1 text-xs text-gray-500",
      className,
    )}
  >
    {Icon && <span className="w-4 h-4 mr-1 text-gray-400">{Icon}</span>}
    {children}
  </Card.Footer>
);

const Title = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx("font-semibold text-gray-900", className)} {...props} />
);

const Row = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={clsx("flex items-center gap-1 text-gray-600", className)}
    {...props}
  />
);

const RowIcon = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={clsx("w-3 h-3 text-gray-400", className)} {...props} />
);

const Rating = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={clsx(
      "px-1 py-0.5 -mt-0.5 font-medium text-orange-600 bg-orange-50 rounded-sm",
      className,
    )}
    {...props}
  />
);

interface ListCardProps {
  linkProps?: LinkProps;
  children: ReactNode;
  footerSlot?: ReactNode;
}

const ListCardRoot = ({ linkProps, children, footerSlot }: ListCardProps) => {
  if (!linkProps) {
    return (
      <Card.Container className="grow text-sm">
        <Card.Content>{children}</Card.Content>
        {footerSlot}
      </Card.Container>
    );
  }
  return (
    <RouterLink {...linkProps} className="block">
      <Card.Container className="grow text-sm">
        <Card.Content>{children}</Card.Content>
        {footerSlot}
      </Card.Container>
    </RouterLink>
  );
};

export const ListCard = Object.assign(ListCardRoot, {
  Footer,
  Title,
  Row,
  RowIcon,
  Rating,
});
