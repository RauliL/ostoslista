import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createEntry } from "../api";
import { AddEntryView } from "./AddEntryView";

vi.mock("../api", () => ({
  createEntry: vi.fn(() => Promise.resolve("new-id")),
}));

const mockCreateEntry = vi.mocked(createEntry);

describe("<AddEntryView/>", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={["/add"]}>
        <IntlProvider locale="en">
          <Routes>
            <Route path="/add" element={<AddEntryView />} />
            <Route path="/todo" element={<div>Todo view</div>} />
          </Routes>
        </IntlProvider>
      </MemoryRouter>,
    );

  beforeEach(() => {
    mockCreateEntry.mockClear();
  });

  afterEach(cleanup);

  it("should render the add new entry form", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: /add new entry/i }),
    ).toBeInTheDocument();
  });

  it("should navigate to the todo list when cancel is clicked", async () => {
    renderComponent();

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByText("Todo view")).toBeInTheDocument();
  });

  it("should create an entry and navigate to the todo list when the form is submitted", async () => {
    renderComponent();

    await userEvent.type(
      screen.getByRole("textbox", { name: /text/i }),
      "Milk",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /url/i }),
      "https://example.com/milk",
    );
    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(mockCreateEntry).toHaveBeenCalledWith(
      "Milk",
      "https://example.com/milk",
    );
    expect(await screen.findByText("Todo view")).toBeInTheDocument();
  });
});
