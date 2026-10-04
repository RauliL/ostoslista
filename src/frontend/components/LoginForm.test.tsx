import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { IntlProvider } from "react-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../context";
import en from "../i18n/en.json";
import { LoginForm } from "./LoginForm";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);

describe("<LoginForm/>", () => {
  const login = vi.fn();
  const clearError = vi.fn();

  const renderComponent = () =>
    render(
      <IntlProvider locale="en" messages={en}>
        <LoginForm />
      </IntlProvider>,
    );

  beforeEach(() => {
    login.mockReset();
    clearError.mockReset();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login,
      logout: vi.fn(),
      clearError,
    });
  });

  afterEach(cleanup);

  it("renders username and password fields", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /^Username/ }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in" }),
    ).toBeInTheDocument();
  });

  it("submits entered credentials", async () => {
    login.mockResolvedValue(undefined);

    renderComponent();

    await userEvent.type(
      screen.getByRole("textbox", { name: /^Username/ }),
      "alice",
    );
    await userEvent.type(screen.getByLabelText(/^Password/), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(clearError).toHaveBeenCalled();
      expect(login).toHaveBeenCalledWith({
        username: "alice",
        password: "secret",
      });
    });
  });

  it("shows an error message from auth context", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: "Invalid credentials",
      login,
      logout: vi.fn(),
      clearError,
    });

    renderComponent();

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
  });
});
