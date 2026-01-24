import { createFileRoute } from "@tanstack/react-router";

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/_public/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: search.redirect as string | undefined,
    };
  },
});
