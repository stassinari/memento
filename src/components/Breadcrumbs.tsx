import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { Link, LinkProps } from "@tanstack/react-router";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  linkTo?: LinkProps["to"];
}

export const BreadcrumbsWithoutHome = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex overflow-hidden" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4 overflow-x-scroll">
        {items.map((item, i) => (
          <li key={item.label}>
            <div className="flex items-center">
              {item.linkTo ? (
                <Link
                  to={item.linkTo}
                  className="mr-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  // aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <p className="mr-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
              )}
              {i !== items.length - 1 && (
                <ChevronRightIcon
                  className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export const BreadcrumbsWithHome = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex mb-2 overflow-hidden" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2 overflow-x-scroll sm:space-x-4">
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300">
              <HomeIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {items.map((item) => (
          <li key={item.label}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
              {item.linkTo ? (
                <Link
                  to={item.linkTo}
                  className="ml-2 whitespace-nowrap text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 sm:ml-4"
                  // aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <p className="ml-2 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400 sm:ml-4">
                  {item.label}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
