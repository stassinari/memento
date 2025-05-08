import clsx from "clsx";
import { HTMLAttributes, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card } from "./Card";

interface FooterProps {
  Icon?: ReactNode;
  text: string;
}

const Footer = ({ Icon, text }: FooterProps) => (
  <Card.Footer className="flex items-center h-8 gap-1 text-xs text-gray-500">
    {Icon && <span className="w-4 h-4 mr-1 text-gray-400">{Icon}</span>}
    {text}
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
      "px-1 py-0.5 -mt-0.5 font-medium text-orange-600 bg-orange-50 rounded",
      className,
    )}
    {...props}
  />
);

interface ListCardProps {
  linkTo: string;
  children: ReactNode;
  footerSlot?: ReactNode;
}

const ListCardRoot = ({ linkTo, children, footerSlot }: ListCardProps) => {
  return (
    <RouterLink to={linkTo} className="block">
      <Card.Container className="flex-grow text-sm">
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
