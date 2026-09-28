import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useEntry } from "../hooks";
import { SavedEntry } from "../types";
import { EntryLayout } from "./EntryLayout";

vi.mock("../hooks", () => ({
  useEntry: vi.fn(),
}));

const mockUseEntry = vi.mocked(useEntry);

const mockTodoEntry: Readonly<SavedEntry> = {
  id: "0985042c-450f-11f0-b247-173dddeb6042",
  text: "Existing entry",
  done: false,
  url: "https://example.com",
};

const mockDoneEntry: Readonly<SavedEntry> = {
  ...mockTodoEntry,
  id: "1985042c-450f-11f0-b247-173dddeb6043",
  text: "Done entry",
  done: true,
};

describe("<EntryLayout/>", () => {
  const renderComponent = (path: string) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <IntlProvider locale="en">
          <Routes>
            <Route element={<EntryLayout />}>
              <Route path="/add" element={<div>Add view</div>} />
              <Route path="/edit/:id" element={<div>Edit view</div>} />
            </Route>
            <Route path="/todo" element={<div>Todo view</div>} />
            <Route path="/done" element={<div>Done view</div>} />
          </Routes>
        </IntlProvider>
      </MemoryRouter>,
    );

  beforeEach(() => {
    mockUseEntry.mockReturnValue({ entry: undefined, isLoading: false });
  });

  afterEach(cleanup);

  it("should render the add new entry title on the add route", () => {
    renderComponent("/add");

    expect(
      screen.getByRole("heading", { name: /add new entry/i }),
    ).toBeInTheDocument();
  });

  it("should render the edit entry title on the edit route", () => {
    mockUseEntry.mockReturnValue({ entry: mockTodoEntry, isLoading: false });

    renderComponent(`/edit/${mockTodoEntry.id}`);

    expect(
      screen.getByRole("heading", { name: /edit entry/i }),
    ).toBeInTheDocument();
  });

  it("should render the nested route content", () => {
    renderComponent("/add");

    expect(screen.getByText("Add view")).toBeInTheDocument();
  });

  it("should link the back button to the todo list when the entry is not done", () => {
    mockUseEntry.mockReturnValue({ entry: mockTodoEntry, isLoading: false });

    renderComponent(`/edit/${mockTodoEntry.id}`);

    expect(screen.getByTestId("ArrowBackIcon").closest("a")).toHaveAttribute(
      "href",
      "/todo",
    );
  });

  it("should link the back button to the done list when the entry is done", () => {
    mockUseEntry.mockReturnValue({ entry: mockDoneEntry, isLoading: false });

    renderComponent(`/edit/${mockDoneEntry.id}`);

    expect(screen.getByTestId("ArrowBackIcon").closest("a")).toHaveAttribute(
      "href",
      "/done",
    );
  });

  it("should link the back button to the todo list when there is no entry", () => {
    renderComponent("/add");

    expect(screen.getByTestId("ArrowBackIcon").closest("a")).toHaveAttribute(
      "href",
      "/todo",
    );
  });

  it("should navigate to the todo list when the back button is clicked", async () => {
    renderComponent("/add");

    await userEvent.click(screen.getByTestId("ArrowBackIcon").closest("a")!);

    expect(screen.getByText("Todo view")).toBeInTheDocument();
  });
});
