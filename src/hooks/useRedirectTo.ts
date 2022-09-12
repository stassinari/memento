import { useLocation } from "react-router-dom";
import { LocationState } from "../components/auth/RequireAuth";

export const useRedirectTo = () => {
  const location = useLocation();
  const redirectTo = (location.state as LocationState | undefined)?.from
    .pathname;

  return redirectTo;
};