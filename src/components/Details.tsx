import React from "react";
import "twin.macro";
import { Link } from "./Link";

interface DetailsRowProps {
  label: string;
  value: string;
  link?: string;
}

const DetailsRow: React.FC<DetailsRowProps> = ({ label, value, link }) => (
  <div tw="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
    <dt tw="text-sm font-medium text-gray-500">{label}</dt>
    <dd tw="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      {link ? <Link to={link}>{value}</Link> : value}
    </dd>
  </div>
);

interface DetailsProps {
  title: string;
  subtitle?: string;
  rows: DetailsRowProps[];
}

export const Details: React.FC<DetailsProps> = ({ title, subtitle, rows }) => {
  return (
    <React.Fragment>
      <div>
        <h3 tw="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        {subtitle && (
          <p tw="max-w-2xl mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      <div tw="mt-5 border-t border-gray-200">
        <dl tw="sm:divide-y sm:divide-gray-200">
          {rows.map(({ label, value, link }) => (
            <DetailsRow key={label} label={label} value={value} link={link} />
          ))}
        </dl>
      </div>
    </React.Fragment>
  );
};
