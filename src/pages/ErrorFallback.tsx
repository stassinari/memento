import { FallbackProps } from "react-error-boundary";
import "twin.macro";
import { Button } from "../components/Button";
import { layoutContainerStyles } from "../components/Layout";

export const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div tw="pt-16 pb-12" css={layoutContainerStyles}>
      <main tw="flex flex-col justify-center flex-grow w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div tw="py-16">
          <div tw="text-center">
            <p tw="text-base font-semibold text-indigo-600">Error</p>
            <h1 tw="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Something went wrong.
            </h1>
            <p tw="mt-2 text-base text-gray-500">
              Sorry, an unknown error has occurred. For more information, look
              at the message below:
            </p>
            <pre tw="max-w-xl px-4 py-2 mx-auto mt-4 overflow-scroll bg-gray-100 rounded">
              {error.message}
            </pre>
            <div tw="inline-flex gap-4 mt-6">
              <Button variant="primary" onClick={resetErrorBoundary}>
                Try again
              </Button>
              <Button as="a" href="/" variant="secondary">
                Go back home<span aria-hidden="true"> &rarr;</span>
              </Button>
              {/* <Link to="/">Go back home</Link> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
