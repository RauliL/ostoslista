import React, { FunctionComponent, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { savePostLoginRedirect } from "../auth";
import { LoadingScreen } from "../components";
import { useAuth } from "../context";

export const RequireAuth: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;

    savePostLoginRedirect(redirectPath);

    return <Navigate to="/login" replace state={{ from: redirectPath }} />;
  }

  return <>{children}</>;
};

RequireAuth.displayName = "RequireAuth";
