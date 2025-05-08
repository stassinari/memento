import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  linkTo: string;
}

export const BreadcrumbsWithoutHome = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex overflow-hidden" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4 overflow-x-scroll">
        {items.map((item, i) => (
          <li key={item.label}>
            <div className="flex items-center">
              <Link
                to={item.linkTo}
                className="mr-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                // aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </Link>
              {i !== items.length - 1 && (
                <ChevronRightIcon
                  className="flex-shrink-0 w-5 h-5 text-gray-400"
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
      <ol
        role="list"
        className="flex items-center space-x-2 overflow-x-scroll sm:space-x-4"
      >
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="flex-shrink-0 w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {items.map((item, i) => (
          <li key={item.label}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="flex-shrink-0 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              {i === items.length - 1 ? (
                <p className="ml-2 text-sm font-medium text-gray-500 sm:ml-4 whitespace-nowrap">
                  {item.label}
                </p>
              ) : (
                <Link
                  to={item.linkTo}
                  className="ml-2 text-sm font-medium text-gray-500 sm:ml-4 hover:text-gray-700 whitespace-nowrap"
                  // aria-current={item.current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
