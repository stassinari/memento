import { LinkProps, useRouterState } from "@tanstack/react-router";

// FIXME try and make it "the TanStack way"
export const useActiveRoute = (link: LinkProps) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (link.to !== "/" && typeof link.to === "string") {
    return pathname.startsWith(link.to);
  } else {
    return pathname === link.to;
  }
};
