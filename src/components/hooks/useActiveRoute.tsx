import { useLocation } from "react-router-dom";

export const useActiveRoute = (linkTo: string) => {
  const { pathname } = useLocation();

  if (linkTo === "/" && pathname === linkTo) {
    return true;
  } else if (linkTo !== "/") {
    return pathname.startsWith(linkTo);
  } else {
    return false;
  }
};
