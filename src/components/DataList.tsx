import { ReactNode } from "react";

import { CalendarIcon } from "@heroicons/react/20/solid";
import { Link } from "@tanstack/react-router";
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
export const DataList = ({ items }: DataListProps) => {
  return (
    <div className="overflow-hidden bg-white shadow-sm sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {items.map(({ topRow, bottomRow, link }, i) => (
          <li key={`${topRow.title}-${i}`}>
            <Link to={link} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-orange-600 truncate">
                    {topRow.title}
                  </p>
                  {topRow.pill && (
                    <div className="flex shrink-0 ml-2">
                      <p className="inline-flex px-2 text-xs font-semibold leading-5 text-gray-500 bg-gray-100 rounded-full">
                        {topRow.pill}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="space-y-2 sm:flex sm:space-y-0 sm:space-x-6">
                    {bottomRow.tags.map(({ icon, label }, i) => (
                      <p
                        key={`${label}-${i}`}
                        className="flex items-center text-sm text-gray-500"
                      >
                        {icon && (
                          <span
                            className="mr-1.5 h-5 w-5 shrink-0 text-gray-400"
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
                    <div className="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
                      <CalendarIcon
                        className="mr-1.5 h-5 w-5 shrink-0 text-gray-400"
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
