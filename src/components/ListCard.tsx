import { Link as RouterLink } from "react-router-dom";
import tw from "twin.macro";
import { Card } from "./Card";

interface FooterProps {
  Icon?: React.ReactNode;
  text: string;
}

const Footer: React.FC<FooterProps> = ({ Icon, text }) => (
  <Card.Footer tw="flex items-center h-8 gap-1 text-xs text-gray-500">
    {Icon && <span tw="w-4 h-4 mr-1 text-gray-400">{Icon}</span>}
    {text}
  </Card.Footer>
);

const Title = tw.p`font-semibold text-gray-900`;

const Row = tw.p`flex items-center gap-1 text-gray-600`;

const RowIcon = tw.span`w-3 h-3 text-gray-400`;

const Rating = tw.span`px-1 py-0.5 -mt-0.5 font-medium text-orange-600 bg-orange-50 rounded`;

interface ListCardProps {
  linkTo: string;
  children: React.ReactNode;
  footerSlot?: React.ReactNode;
}

const ListCardRoot: React.FC<ListCardProps> = ({
  linkTo,
  children,
  footerSlot,
}) => {
  return (
    <RouterLink to={linkTo}>
      <Card.Container tw="flex-grow text-sm">
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
