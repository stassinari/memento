import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { EmailPasswordLogin } from "@/components/EmailPasswordLogin";
import { GoogleLogin } from "@/components/GoogleLogin";
import {
  layoutContainerCssStyles,
  layoutContainerTailwindStyles,
} from "@/components/Layout";
import { createLazyFileRoute } from "@tanstack/react-router";
import clsx from "clsx";

export const Route = createLazyFileRoute("/_public/login")({
  component: LogIn,
});

function LogIn() {
  return (
    <div
      className={clsx(layoutContainerTailwindStyles)}
      style={layoutContainerCssStyles}
    >
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
