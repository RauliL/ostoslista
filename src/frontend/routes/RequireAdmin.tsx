import React, { FunctionComponent, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context";

export const RequireAdmin: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/todo" replace />;
  }

  return <>{children}</>;
};

RequireAdmin.displayName = "RequireAdmin";
