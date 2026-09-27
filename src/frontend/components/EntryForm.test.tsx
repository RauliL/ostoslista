import {
  cleanup,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { noop } from "lodash-es";
import React from "react";
import { IntlProvider } from "react-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { EntryForm, EntryFormProps } from "./EntryForm";

describe("<EntryForm/>", () => {
  const renderComponent = (props: Partial<EntryFormProps> = {}) =>
    render(
      <IntlProvider locale="en">
        <EntryForm
          initialValues={props.initialValues}
          onCancel={props.onCancel ?? noop}
          onSubmit={props.onSubmit ?? (() => Promise.resolve())}
          title={props.title ?? "Test title"}
        />
      </IntlProvider>,
    );

  afterEach(cleanup);

  it("should render the given title", () => {
    renderComponent({ title: "Add new entry" });

    expect(
      screen.getByRole("heading", { name: /add new entry/i }),
    ).toBeInTheDocument();
  });

  it("should render initial values when given", () => {
    renderComponent({
      initialValues: {
        text: "Existing entry",
        url: "https://example.com",
      },
    });

    expect(screen.getByRole("textbox", { name: /text/i })).toHaveValue(
      "Existing entry",
    );
    expect(screen.getByRole("textbox", { name: /url/i })).toHaveValue(
      "https://example.com",
    );
  });

  it("should invoke `onCancel` callback when cancel button is clicked", async () => {
    const onCancel = vi.fn();

    renderComponent({ onCancel });

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  it("should invoke `onSubmit` callback with form values when add button is clicked", async () => {
    const onSubmit = vi.fn(() => Promise.resolve());

    renderComponent({ onSubmit });

    await userEvent.type(
      screen.getByRole("textbox", { name: /text/i }),
      "Milk",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /url/i }),
      "https://example.com/milk",
    );
    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      text: "Milk",
      url: "https://example.com/milk",
    });
  });

  it("should invoke `onSubmit` with initial values when they are left unchanged", async () => {
    const onSubmit = vi.fn(() => Promise.resolve());

    renderComponent({
      initialValues: {
        text: "Existing entry",
        url: "https://example.com",
      },
      onSubmit,
    });

    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      text: "Existing entry",
      url: "https://example.com",
    });
  });

  it("should not invoke `onSubmit` callback when text is empty", async () => {
    const onSubmit = vi.fn(() => Promise.resolve());

    renderComponent({ onSubmit });

    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should show an error snackbar when `onSubmit` fails", async () => {
    const onSubmit = vi.fn(() => Promise.reject(new Error("API error")));

    renderComponent({ onSubmit });

    await userEvent.type(
      screen.getByRole("textbox", { name: /text/i }),
      "Milk",
    );
    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(
      await screen.findByText(/api returned erroneous response/i),
    ).toBeInTheDocument();
  });

  it("should hide the error snackbar when it is closed", async () => {
    const onSubmit = vi.fn(() => Promise.reject(new Error("API error")));

    renderComponent({ onSubmit });

    await userEvent.type(
      screen.getByRole("textbox", { name: /text/i }),
      "Milk",
    );
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    await screen.findByText(/api returned erroneous response/i);

    await userEvent.click(screen.getByTestId("close-button"));

    await waitForElementToBeRemoved(() =>
      screen.queryByText(/api returned erroneous response/i),
    );
  });

  it("should hide the error snackbar when a later submit succeeds", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValueOnce(new Error("API error"))
      .mockResolvedValueOnce(undefined);

    renderComponent({ onSubmit });

    await userEvent.type(
      screen.getByRole("textbox", { name: /text/i }),
      "Milk",
    );
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    await screen.findByText(/api returned erroneous response/i);

    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    await waitForElementToBeRemoved(() =>
      screen.queryByText(/api returned erroneous response/i),
    );
  });
});
