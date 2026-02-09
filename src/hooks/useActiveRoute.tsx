import { LinkProps, useRouterState } from "@tanstack/react-router";

// FIXME try and make it "the TanStack way"
export const useActiveRoute = (linkTo: LinkProps["to"]) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (linkTo !== "/" && typeof linkTo === "string") {
    return pathname.startsWith(linkTo);
  } else {
    return pathname === linkTo;
  }
};
