import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { Card } from "~/components/Card";
import { Divider } from "~/components/Divider";
import { EmailPasswordLogin } from "~/components/EmailPasswordLogin";
import { GoogleLogin } from "~/components/GoogleLogin";
import { layoutContainerCssStyles, layoutContainerTailwindStyles } from "~/components/Layout";

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/_public/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: search.redirect as string | undefined,
    };
  },
  component: LogIn,
});

function LogIn() {
  return (
    <div className={clsx(layoutContainerTailwindStyles)} style={layoutContainerCssStyles}>
      <div className="px-4 sm:px-0 sm:mx-auto sm:max-w-md">
        <h2 className="my-6 text-3xl font-bold tracking-tight text-center text-gray-900">
          Sign in to Memento
        </h2>
        <Card>
          <EmailPasswordLogin />
          <Divider label="Or continue with" />
          <GoogleLogin />
        </Card>
      </div>
    </div>
  );
}
