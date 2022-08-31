import { FallbackProps } from "react-error-boundary";
import { ErrorPage } from "../pages/ErrorPage";

export const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <ErrorPage
    title="Something went wrong."
    description="Sorry, an unknown error has occurred. For more information, look
at the message below:"
    errorMessage={error.message}
    retry={resetErrorBoundary}
  />
);
