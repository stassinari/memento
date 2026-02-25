import { ReactNode } from "react";

import { CalendarIcon } from "@heroicons/react/20/solid";
import { Link } from "@tanstack/react-router";
import { getTimeAgo } from "~/util";

export interface DataListItem {
  topRow: {
    title: string;
    pill?: string | null;
  };
  bottomRow: {
    tags: Array<{ icon?: ReactNode; label: string }>;
    date?: Date | null;
  };
  link: string;
}

interface DataListProps {
  items: DataListItem[];
}
export const DataList = ({ items }: DataListProps) => {
  return (
    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-900 dark:ring-1 dark:ring-white/10 sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-white/10">
        {items.map(({ topRow, bottomRow, link }, i) => (
          <li key={`${topRow.title}-${i}`}>
            <Link to={link} className="block hover:bg-gray-50 dark:hover:bg-white/5">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-orange-600 dark:text-orange-400">
                    {topRow.title}
                  </p>
                  {topRow.pill && (
                    <div className="ml-2 flex shrink-0">
                      <p className="inline-flex rounded-full bg-gray-100 px-2 text-xs leading-5 font-semibold text-gray-500 dark:bg-white/10 dark:text-gray-300">
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
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        {icon && (
                          <span
                            className="mr-1.5 h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
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
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                      <CalendarIcon
                        className="mr-1.5 h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
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
