import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import "twin.macro";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonLabel: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonLabel,
}) => {
  return (
    <div tw="mt-32 text-center">
      <CubeTransparentIcon tw="w-12 h-12 mx-auto text-gray-400" />
      <h3 tw="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p tw="mt-1 text-sm text-gray-500">{description}</p>
      <div tw="mt-6">
        <Button variant="primary" as={Link} to="add">
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};
