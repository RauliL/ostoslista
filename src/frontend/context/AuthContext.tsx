import { PublicUser } from "express-varasto-jwt-auth";
import React, {
  FunctionComponent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useIntl } from "react-intl";

import { clearPostLoginRedirect } from "../auth/postLoginRedirect";
import * as authApi from "../authApi";
import { ApiError, getStoredToken, setStoredToken } from "../authToken";
import { LoginRequest } from "../types";

type AuthContextValue = {
  user: PublicUser | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const intl = useIntl();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const restoreSession = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { user: currentUser } = await authApi.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
      } else {
        setStoredToken(null);
        setUser(null);
      }
    } catch {
      setStoredToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setError(null);

      try {
        const response = await authApi.login(credentials);

        setStoredToken(response.token);
        setUser(response.user);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : intl.formatMessage({
                id: "loginFailed",
                defaultMessage: "Unable to sign in.",
              });

        setError(message);

        throw err;
      }
    },
    [intl],
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
    setError(null);
    clearPostLoginRedirect();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      clearError,
    }),
    [user, loading, error, login, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
