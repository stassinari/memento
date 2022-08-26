import { FallbackProps } from "react-error-boundary";
import "twin.macro";
import { Button } from "../components/Button";

export const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div tw="min-h-full pt-16 pb-12">
      <main tw="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div tw="py-16">
          <div tw="text-center">
            <p tw="text-base font-semibold text-indigo-600">Error</p>
            <h1 tw="mt-2 text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
              Something went wrong.
            </h1>
            <p tw="mt-2 text-base text-gray-500">
              Sorry, an unknown error has occurred. For more information, look
              at the message below:
            </p>
            <pre tw="max-w-xl overflow-scroll mx-auto mt-4 bg-gray-100 rounded px-4 py-2">
              {error.message}
            </pre>
            <div tw="mt-6">
              <Button
                label="Try again"
                variant="primary"
                onClick={resetErrorBoundary}
              />
              <a
                href="/"
                tw="text-base font-medium text-indigo-600 hover:text-indigo-500"
              >
                Go back home<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
