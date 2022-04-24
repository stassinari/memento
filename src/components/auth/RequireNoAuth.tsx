import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "reactfire";

export const RequireNoAuth = () => {
  const { data: user } = useUser();

  if (user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
