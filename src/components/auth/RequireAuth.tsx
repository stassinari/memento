import { Location, Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "../../firebaseConfig";

export interface LocationState {
  from: Location;
}

export const RequireAuth = () => {
  // const { data: user } = useUser();
  const user = auth.currentUser;

  const location = useLocation();

  if (!user) {
    // pass state to navigate user back to where they came from
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
};
