import { useRouterState } from "@tanstack/react-router";

export const useActiveRoute = (linkTo: string) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (linkTo !== "/") {
    return pathname.startsWith(linkTo);
  } else {
    return pathname === linkTo;
  }
};
