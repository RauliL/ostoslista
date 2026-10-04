import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../context";
import { ListLayout } from "./ListLayout";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);

describe("<ListLayout/>", () => {
  const renderComponent = (path = "/todo") =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <IntlProvider locale="en">
          <Routes>
            <Route element={<ListLayout />}>
              <Route path="/todo" element={<div>Todo view</div>} />
              <Route path="/done" element={<div>Done view</div>} />
            </Route>
            <Route path="/add" element={<div>Add view</div>} />
            <Route path="/login" element={<div>Login view</div>} />
            <Route path="/admin/users" element={<div>Admin view</div>} />
          </Routes>
        </IntlProvider>
      </MemoryRouter>,
    );

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { username: "alice", isAdmin: false },
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });
  });

  afterEach(cleanup);

  it("should render the app title", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: /ostoslista/i }),
    ).toBeInTheDocument();
  });

  it("should render the nested route content", () => {
    renderComponent("/todo");

    expect(screen.getByText("Todo view")).toBeInTheDocument();
  });

  it("should link the add button to the add entry view", () => {
    renderComponent();

    expect(screen.getByTestId("AddIcon").closest("a")).toHaveAttribute(
      "href",
      "/add",
    );
  });

  it("should navigate to the add entry view when the add button is clicked", async () => {
    renderComponent();

    await userEvent.click(screen.getByTestId("AddIcon").closest("a")!);

    expect(screen.getByText("Add view")).toBeInTheDocument();
  });

  it("should render bottom navigation links for todo and done lists", () => {
    renderComponent();

    expect(screen.getByRole("link", { name: /todo/i })).toHaveAttribute(
      "href",
      "/todo",
    );
    expect(screen.getByRole("link", { name: /done/i })).toHaveAttribute(
      "href",
      "/done",
    );
  });

  it("should mark the todo navigation item as selected on the todo route", () => {
    renderComponent("/todo");

    expect(screen.getByRole("link", { name: /todo/i })).toHaveClass(
      "Mui-selected",
    );
    expect(screen.getByRole("link", { name: /done/i })).not.toHaveClass(
      "Mui-selected",
    );
  });

  it("should mark the done navigation item as selected on the done route", () => {
    renderComponent("/done");

    expect(screen.getByRole("link", { name: /done/i })).toHaveClass(
      "Mui-selected",
    );
    expect(screen.getByRole("link", { name: /todo/i })).not.toHaveClass(
      "Mui-selected",
    );
  });

  it("should navigate to the done list when the done navigation item is clicked", async () => {
    renderComponent("/todo");

    await userEvent.click(screen.getByRole("link", { name: /done/i }));

    expect(screen.getByText("Done view")).toBeInTheDocument();
  });

  it("should navigate to the todo list when the todo navigation item is clicked", async () => {
    renderComponent("/done");

    await userEvent.click(screen.getByRole("link", { name: /todo/i }));

    expect(screen.getByText("Todo view")).toBeInTheDocument();
  });

  it("should show the admin link for administrators", () => {
    mockUseAuth.mockReturnValue({
      user: { username: "admin", isAdmin: true },
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    renderComponent();

    expect(screen.getByLabelText("Admin").closest("a")).toHaveAttribute(
      "href",
      "/admin/users",
    );
  });

  it("should call logout and navigate to login when sign out is clicked", async () => {
    const logout = vi.fn();
    mockUseAuth.mockReturnValue({
      user: { username: "alice", isAdmin: false },
      loading: false,
      error: null,
      login: vi.fn(),
      logout,
      clearError: vi.fn(),
    });

    renderComponent();

    await userEvent.click(screen.getByLabelText("Sign out"));

    expect(logout).toHaveBeenCalled();
    expect(screen.getByText("Login view")).toBeInTheDocument();
  });
});
