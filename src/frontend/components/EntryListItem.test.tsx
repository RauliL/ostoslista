import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { EntryListItem, EntryListItemProps } from "./EntryListItem";
import { SavedEntry } from "../types";

const mockEntry: Readonly<SavedEntry> = {
  id: "153511a8-4439-11f0-b6a8-dfe4dbf5c378",
  text: "Mock text.",
  done: false,
};

describe("<EntryListItem/>", () => {
  const renderComponent = (props: Partial<EntryListItemProps> = {}) =>
    render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={
              <EntryListItem
                entry={props.entry ?? mockEntry}
                onDelete={props.onDelete ?? (() => Promise.resolve())}
                onToggle={props.onToggle ?? (() => Promise.resolve())}
              />
            }
          />
          <Route path="/edit/:id" element={<div>Edit view</div>} />
        </Routes>
      </MemoryRouter>,
    );

  afterEach(cleanup);

  it("should render entry text as a link to the edit view", () => {
    renderComponent();

    expect(screen.getByRole("link", { name: /mock text/i })).toHaveAttribute(
      "href",
      `/edit/${mockEntry.id}`,
    );
  });

  it("should navigate to edit view when the list item is double clicked", async () => {
    renderComponent();

    await userEvent.pointer({
      keys: "[MouseLeft][MouseLeft]",
      target: screen.getByRole("listitem"),
    });

    expect(screen.getByText("Edit view")).toBeInTheDocument();
  });

  it("should invoke `onToggle` callback when checkbox is clicked", async () => {
    const onToggle = vi.fn(() => Promise.resolve());

    renderComponent({ onToggle });

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onToggle).toBeCalled();
  });

  it("should invoke `onDelete` callback when delete button is clicked", async () => {
    const onDelete = vi.fn(() => Promise.resolve());

    renderComponent({ onDelete });

    await userEvent.click(screen.getByTestId("delete-button"));

    expect(onDelete).toBeCalled();
  });
});
