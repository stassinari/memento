import { FallbackProps } from "react-error-boundary";
import { ErrorPage } from "../pages/ErrorPage";

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => (
  <ErrorPage
    title="Something went wrong."
    description="Sorry, an unknown error has occurred. For more information, look
at the message below:"
    errorMessage={error.message}
    retry={resetErrorBoundary}
  />
);
