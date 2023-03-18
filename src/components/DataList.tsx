import { ReactNode } from "react";
import "twin.macro";

import { CalendarIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { getTimeAgo } from "../util";

export interface DataListItem {
  topRow: {
    title: string;
    pill?: string;
  };
  bottomRow: {
    tags: Array<{ icon?: ReactNode; label: string }>;
    date?: Date;
  };
  link: string;
}

interface DataListProps {
  items: DataListItem[];
}
export const DataList: React.FC<DataListProps> = ({ items }) => {
  return (
    <div tw="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" tw="divide-y divide-gray-200">
        {items.map(({ topRow, bottomRow, link }, i) => (
          <li key={`${topRow.title}-${i}`}>
            <Link to={link} tw="block hover:bg-gray-50">
              <div tw="px-4 py-4 sm:px-6">
                <div tw="flex items-center justify-between">
                  <p tw="text-sm font-medium text-orange-600 truncate">
                    {topRow.title}
                  </p>
                  {topRow.pill && (
                    <div tw="flex flex-shrink-0 ml-2">
                      <p tw="inline-flex px-2 text-xs font-semibold leading-5 text-gray-500 bg-gray-100 rounded-full">
                        {topRow.pill}
                      </p>
                    </div>
                  )}
                </div>
                <div tw="mt-2 sm:flex sm:justify-between">
                  <div tw="space-y-2 sm:(flex space-y-0 space-x-6)">
                    {bottomRow.tags.map(({ icon, label }, i) => (
                      <p
                        key={`${label}-${i}`}
                        tw="flex items-center text-sm text-gray-500"
                      >
                        {icon && (
                          <span
                            tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          >
                            {icon}
                          </span>
                        )}
                        {label}
                      </p>
                    ))}
                  </div>
                  {bottomRow.date && (
                    <div tw="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
                      <CalendarIcon
                        tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <p>
                        Roasted{" "}
                        <time dateTime={bottomRow.date.toLocaleDateString()}>
                          {getTimeAgo(bottomRow.date)}
                        </time>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
