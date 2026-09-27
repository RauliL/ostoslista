import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { deleteEntry, patchEntry } from "../api";
import { useAllEntries } from "../hooks";
import { SavedEntry } from "../types";
import { EntryList, EntryListProps } from "./EntryList";

vi.mock("../hooks", () => ({
  useAllEntries: vi.fn(),
}));

vi.mock("../api", () => ({
  deleteEntry: vi.fn(() => Promise.resolve({})),
  patchEntry: vi.fn(() => Promise.resolve({})),
}));

vi.mock("swr", () => ({
  mutate: vi.fn(() => Promise.resolve()),
}));

const mockUseAllEntries = vi.mocked(useAllEntries);
const mockDeleteEntry = vi.mocked(deleteEntry);
const mockPatchEntry = vi.mocked(patchEntry);

const mockTodoEntry: Readonly<SavedEntry> = {
  id: "0985042c-450f-11f0-b247-173dddeb6042",
  text: "Test",
  done: false,
};

const mockDoneEntry: Readonly<SavedEntry> = {
  id: "1985042c-450f-11f0-b247-173dddeb6043",
  text: "Done test",
  done: true,
};

describe("<EntryList/>", () => {
  const renderComponent = (props: Partial<EntryListProps> = {}) =>
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <Routes>
            <Route
              path="/"
              element={<EntryList type={props.type ?? "todo"} />}
            />
            <Route path="/edit/:id" element={<div>Edit view</div>} />
          </Routes>
        </IntlProvider>
      </MemoryRouter>,
    );

  beforeEach(() => {
    mockUseAllEntries.mockReturnValue({
      todoEntries: [],
      doneEntries: [],
      error: undefined,
    });
    mockDeleteEntry.mockClear();
    mockPatchEntry.mockClear();
  });

  afterEach(cleanup);

  it("should not render delete all entries button for todo lists", async () => {
    mockUseAllEntries.mockReturnValue({
      todoEntries: [mockTodoEntry],
      doneEntries: [],
      error: undefined,
    });

    renderComponent({ type: "todo" });

    await waitFor(() => {
      expect(screen.getByRole("listitem")).toBeInTheDocument();
    });
    expect(screen.queryByText(/delete all/i)).not.toBeInTheDocument();
  });

  it("should not render delete all entries button if the entry list is empty", () => {
    renderComponent({ type: "done" });

    expect(screen.queryByText(/delete all/i)).not.toBeInTheDocument();
  });

  it("should delete all done entries when delete all entries button is clicked", async () => {
    mockUseAllEntries.mockReturnValue({
      todoEntries: [],
      doneEntries: [mockDoneEntry],
      error: undefined,
    });

    renderComponent({ type: "done" });

    await userEvent.click(screen.getByRole("button", { name: /delete all/i }));
    await userEvent.click(screen.getByRole("button", { name: /yes/i }));

    expect(mockDeleteEntry).toHaveBeenCalledWith(mockDoneEntry.id);
  });

  it("should render each entry as an list item", async () => {
    mockUseAllEntries.mockReturnValue({
      todoEntries: [
        { ...mockTodoEntry, id: "1" },
        { ...mockTodoEntry, id: "2" },
        { ...mockTodoEntry, id: "3" },
      ],
      doneEntries: [],
      error: undefined,
    });

    renderComponent({ type: "todo" });

    await waitFor(() => {
      expect(screen.queryAllByRole("listitem")).toHaveLength(3);
    });
  });

  it("should delete an entry when delete button is clicked", async () => {
    mockUseAllEntries.mockReturnValue({
      todoEntries: [mockTodoEntry],
      doneEntries: [],
      error: undefined,
    });

    renderComponent({ type: "todo" });

    await userEvent.click(await screen.findByTestId("delete-button"));

    expect(mockDeleteEntry).toHaveBeenCalledWith(mockTodoEntry.id);
  });

  it("should navigate to edit view when entry is double clicked", async () => {
    mockUseAllEntries.mockReturnValue({
      todoEntries: [mockTodoEntry],
      doneEntries: [],
      error: undefined,
    });

    renderComponent({ type: "todo" });

    await userEvent.pointer({
      keys: "[MouseLeft][MouseLeft]",
      target: await screen.findByRole("listitem"),
    });

    expect(screen.getByText("Edit view")).toBeInTheDocument();
  });

  it("should toggle an entry when checkbox is clicked", async () => {
    mockUseAllEntries.mockReturnValue({
      todoEntries: [mockTodoEntry],
      doneEntries: [],
      error: undefined,
    });

    renderComponent({ type: "todo" });

    await userEvent.click(await screen.findByRole("checkbox"));

    expect(mockPatchEntry).toHaveBeenCalledWith(mockTodoEntry.id, {
      ...mockTodoEntry,
      done: true,
    });
  });
});
