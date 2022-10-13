import { CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/20/solid";
import { QueryConstraint } from "firebase/firestore";
import { Fragment, ReactNode } from "react";
import { Link } from "react-router-dom";
import "twin.macro";
import { useFirestoreList } from "../../hooks/firestore/useFirestoreList";
import { Beans } from "../../types/beans";
import { getTimeAgo, isNotFrozenOrIsThawed } from "../../util";

export interface BeansTabProps {
  name: "Archived" | "Frozen" | "Open";
  filters: QueryConstraint[];
  removeFrozen?: boolean;
  EmptyState: ReactNode;
}

export const BeansTab: React.FC<BeansTabProps> = ({
  filters,
  removeFrozen,
  EmptyState,
}) => {
  const { list: beansList, isLoading } = useFirestoreList<Beans>(
    "beans",
    filters
  );

  if (isLoading) return null;

  const sortedAndFiltered = beansList
    .sort((a, b) =>
      (a.roastDate?.toDate() || 0) < (b.roastDate?.toDate() || 0) ? 1 : -1
    )
    .filter(removeFrozen ? isNotFrozenOrIsThawed : () => true);

  if (sortedAndFiltered.length === 0) return <Fragment>{EmptyState}</Fragment>;

  return (
    <div tw="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" tw="divide-y divide-gray-200">
        {sortedAndFiltered.map((b) => (
          <li key={b.id}>
            <Link to={`/beans/${b.id}`} tw="block hover:bg-gray-50">
              <div tw="px-4 py-4 sm:px-6">
                <div tw="flex items-center justify-between">
                  <p tw="text-sm font-medium text-orange-600 truncate">
                    {b.name}
                  </p>
                  <div tw="flex flex-shrink-0 ml-2">
                    <p tw="inline-flex px-2 text-xs font-semibold leading-5 text-gray-500 bg-gray-100 rounded-full">
                      {b.process}
                    </p>
                  </div>
                </div>
                <div tw="mt-2 sm:flex sm:justify-between">
                  <div tw="sm:flex">
                    <p tw="flex items-center text-sm text-gray-500">
                      <UsersIcon
                        tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      {b.roaster}
                    </p>
                    {b.country && (
                      <p tw="flex items-center mt-2 text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <MapPinIcon
                          tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {b.country}
                      </p>
                    )}
                  </div>
                  {b.roastDate && (
                    <div tw="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
                      <CalendarIcon
                        tw="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <p>
                        Roasted{" "}
                        <time
                          dateTime={b.roastDate.toDate().toLocaleDateString()}
                        >
                          {getTimeAgo(b.roastDate.toDate())}
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
