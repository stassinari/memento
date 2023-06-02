import { ReactNode } from "react";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import { Action } from "./ButtonWithDropdown";
import { Card } from "./Card";

interface DetailsCardRowProps {
  label: string;
  value: string | ReactNode;
}

interface DetailsCardProps {
  title: string;
  action?: Action;
  rows: DetailsCardRowProps[];
}

const actionStiles = tw`font-medium text-sm text-orange-600 hover:(text-orange-500 underline)`;

export const DetailsCard: React.FC<DetailsCardProps> = ({
  title,
  action,
  rows,
}) => {
  return (
    <Card>
      <div tw="flex justify-between mb-3">
        <h3 tw="text-sm font-bold leading-6 text-gray-900">{title}</h3>
        {action &&
          (action.type === "link" ? (
            <Link to={action.href} css={actionStiles}>
              {action.label}
            </Link>
          ) : (
            <button type="button" onClick={action.onClick} css={actionStiles}>
              {action.label}
            </button>
          ))}
      </div>
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
    </Card>
  );
};
