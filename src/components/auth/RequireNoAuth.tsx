import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../../firebaseConfig";

export const RequireNoAuth = () => {
  // const { data: user } = useUser();
  const user = auth.currentUser;

  if (user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
