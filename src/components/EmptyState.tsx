import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonLabel?: string;
}

export const EmptyState = ({
  title,
  description,
  buttonLabel,
}: EmptyStateProps) => {
  return (
    <div className="mt-32 text-center">
      <CubeTransparentIcon className="w-12 h-12 mx-auto text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {buttonLabel && (
        <div className="mt-6">
          <Button variant="primary" asChild>
            <Link to="./add">{buttonLabel}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
