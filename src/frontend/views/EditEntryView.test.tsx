import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { patchEntry } from "../api";
import { useEntry } from "../hooks";
import { SavedEntry } from "../types";
import { EditEntryView } from "./EditEntryView";

vi.mock("../api", () => ({
  patchEntry: vi.fn(() => Promise.resolve({})),
}));

vi.mock("../hooks", () => ({
  useEntry: vi.fn(),
}));

const mockPatchEntry = vi.mocked(patchEntry);
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

describe("<EditEntryView/>", () => {
  const renderComponent = (id = mockTodoEntry.id) =>
    render(
      <MemoryRouter initialEntries={[`/edit/${id}`]}>
        <IntlProvider locale="en">
          <Routes>
            <Route path="/edit/:id" element={<EditEntryView />} />
            <Route path="/todo" element={<div>Todo view</div>} />
            <Route path="/done" element={<div>Done view</div>} />
          </Routes>
        </IntlProvider>
      </MemoryRouter>,
    );

  beforeEach(() => {
    mockUseEntry.mockReturnValue({ entry: mockTodoEntry, isLoading: false });
    mockPatchEntry.mockClear();
  });

  afterEach(cleanup);

  it("should render a loading indicator while the entry is loading", () => {
    mockUseEntry.mockReturnValue({ entry: undefined, isLoading: true });

    renderComponent();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should render a not found message when the entry is not found", () => {
    mockUseEntry.mockReturnValue({ entry: undefined, isLoading: false });

    renderComponent();

    expect(
      screen.getByRole("heading", { name: /404 – page not found/i }),
    ).toBeInTheDocument();
  });

  it("should render the edit entry form with initial values", () => {
    renderComponent();

    expect(screen.getByRole("textbox", { name: /text/i })).toHaveValue(
      mockTodoEntry.text,
    );
    expect(screen.getByRole("textbox", { name: /url/i })).toHaveValue(
      mockTodoEntry.url,
    );
  });

  it("should navigate to the todo list when cancel is clicked for a todo entry", async () => {
    renderComponent();

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByText("Todo view")).toBeInTheDocument();
  });

  it("should navigate to the done list when cancel is clicked for a done entry", async () => {
    mockUseEntry.mockReturnValue({ entry: mockDoneEntry, isLoading: false });

    renderComponent(mockDoneEntry.id);

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByText("Done view")).toBeInTheDocument();
  });

  it("should patch the entry and navigate to the todo list when the form is submitted", async () => {
    renderComponent();

    await userEvent.clear(screen.getByRole("textbox", { name: /text/i }));
    await userEvent.type(
      screen.getByRole("textbox", { name: /text/i }),
      "Updated entry",
    );
    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(mockPatchEntry).toHaveBeenCalledWith(mockTodoEntry.id, {
      ...mockTodoEntry,
      text: "Updated entry",
    });
    expect(await screen.findByText("Todo view")).toBeInTheDocument();
  });
});
