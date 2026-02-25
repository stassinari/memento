import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { Link, LinkProps } from "@tanstack/react-router";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  button?: {
    label: string;
    link: LinkProps["to"];
  };
}

export const EmptyState = ({ title, description, button }: EmptyStateProps) => {
  return (
    <div className="mt-32 text-center">
      <CubeTransparentIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      {button && (
        <div className="mt-6">
          <Button variant="primary" asChild>
            <Link to={button.link}>{button.label}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
