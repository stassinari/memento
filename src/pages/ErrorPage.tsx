import clsx from "clsx";
import { Button } from "../components/Button";
import {
  layoutContainerCssStyles,
  layoutContainerTailwindStyles,
} from "../components/Layout";

interface ErrorPageProps {
  title: string;
  description: string;
  errorMessage?: string;
  retry?: () => void;
}

export const ErrorPage = ({
  title,
  description,
  errorMessage,
  retry,
}: ErrorPageProps) => (
  <div
    className={clsx("pt-16 pb-12", layoutContainerTailwindStyles)}
    style={layoutContainerCssStyles}
  >
    <main className="flex flex-col justify-center grow w-full h-screen px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="py-16">
        <div className="text-center">
          <p className="text-base font-semibold text-orange-600">Error</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-base text-gray-500">{description}</p>
          {errorMessage && (
            <pre className="max-w-xl px-4 py-2 mx-auto mt-4 overflow-scroll bg-gray-100 rounded-sm">
              {errorMessage}
            </pre>
          )}
          <div className="inline-flex gap-4 mt-6">
            {retry && (
              <Button variant="primary" onClick={retry}>
                Try again
              </Button>
            )}
            <Button variant="secondary" asChild>
              <a href="/">
                Go back home<span aria-hidden="true"> &rarr;</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  </div>
);
