import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';

import { SavedEntry } from '../types';
import { EntryList, EntryListProps } from './EntryList';

const mockEntry: Readonly<SavedEntry> = {
  id: '0985042c-450f-11f0-b247-173dddeb6042',
  text: 'Test',
  done: false,
};

describe('<EntryList/>', () => {
  const renderComponent = (props: Partial<EntryListProps> = {}) =>
    render(
      <IntlProvider locale="en">
        <EntryList
          entries={props.entries ?? []}
          onDeleteAllEntries={props.onDeleteAllEntries}
          onEntryDelete={props.onEntryDelete ?? (() => Promise.resolve())}
          onEntrySelect={props.onEntrySelect ?? noop}
          onEntryToggle={props.onEntryToggle ?? (() => Promise.resolve())}
        />
      </IntlProvider>
    );

  afterEach(cleanup);

  it('should not render delete all entries button if no callback is given', () => {
    renderComponent({ onDeleteAllEntries: undefined, entries: [mockEntry] });

    expect(screen.queryByText(/delete all/i)).not.toBeInTheDocument();
  });

  it('should not render delete all entries button if the entry list is empty', () => {
    renderComponent({
      onDeleteAllEntries: () => Promise.resolve(),
      entries: [],
    });

    expect(screen.queryByText(/delete all/i)).not.toBeInTheDocument();
  });

  it('should invoke `onDeleteAllEntries` callback when delete all entries button is clicked', async () => {
    const onDeleteAllEntries = vi.fn(() => Promise.resolve());

    renderComponent({ entries: [mockEntry], onDeleteAllEntries });

    await userEvent.click(screen.getByRole('button', { name: /delete all/i }));
    await userEvent.click(screen.getByRole('button', { name: /yes/i }));

    expect(onDeleteAllEntries).toHaveBeenCalled();
  });

  it('should render each entry as an list item', () => {
    renderComponent({
      entries: [
        { ...mockEntry, id: '1' },
        { ...mockEntry, id: '2' },
        { ...mockEntry, id: '3' },
      ],
    });

    expect(screen.queryAllByRole('listitem')).toHaveLength(3);
  });

  it('should invoke `onEntryDelete` callback when delete button is clicked on an entry', async () => {
    const onEntryDelete = vi.fn(() => Promise.resolve());

    renderComponent({ entries: [mockEntry], onEntryDelete });

    await userEvent.click(screen.getByTestId('delete-button'));

    expect(onEntryDelete).toBeCalledWith(mockEntry);
  });

  it('should invoke `onEntrySelect` callback when entry is double clicked', async () => {
    const onEntrySelect = vi.fn(() => Promise.resolve());

    renderComponent({ entries: [mockEntry], onEntrySelect });

    await userEvent.pointer({
      keys: '[MouseLeft][MouseLeft]',
      target: screen.getByRole('listitem'),
    });

    expect(onEntrySelect).toBeCalledWith(mockEntry);
  });

  it('should invoke `onToggle` callback when entry checkbox is clicked', async () => {
    const onEntryToggle = vi.fn(() => Promise.resolve());

    renderComponent({ entries: [mockEntry], onEntryToggle });

    await userEvent.click(screen.getByRole('checkbox'));

    expect(onEntryToggle).toBeCalledWith(mockEntry);
  });
});
