import { LinkProps, Link as RouterLink } from "@tanstack/react-router";
import clsx from "clsx";
import { HTMLAttributes, ReactNode } from "react";
import { Card } from "./Card";

type FooterProps = {
  Icon?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Footer = ({ Icon, children, className }: FooterProps) => (
  <Card.Footer
    className={clsx("flex h-8 items-center gap-1 text-xs text-gray-500 dark:text-gray-400", className)}
  >
    {Icon && <span className="mr-1 h-4 w-4 text-gray-400 dark:text-gray-500">{Icon}</span>}
    {children}
  </Card.Footer>
);

const Title = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx("font-semibold text-gray-900 dark:text-gray-100", className)} {...props} />
);

const Row = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx("flex items-center gap-1 text-gray-600 dark:text-gray-300", className)} {...props} />
);

const RowIcon = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={clsx("h-3 w-3 text-gray-400 dark:text-gray-500", className)} {...props} />
);

const Rating = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={clsx(
      "-mt-0.5 rounded-sm bg-orange-50 px-1 py-0.5 font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
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
