import { cleanup, render, screen } from '@testing-library/react';
import { noop } from 'lodash';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EntryListItem, EntryListItemProps } from './EntryListItem';
import { SavedEntry } from '../types';
import userEvent from '@testing-library/user-event';

const mockEntry: Readonly<SavedEntry> = {
  id: '153511a8-4439-11f0-b6a8-dfe4dbf5c378',
  text: 'Mock text.',
  done: false,
};

describe('<EntryListItem/>', () => {
  const renderComponent = (props: Partial<EntryListItemProps> = {}) =>
    render(
      <EntryListItem
        entry={props.entry ?? mockEntry}
        onDelete={props.onDelete ?? (() => Promise.resolve())}
        onSelect={props.onSelect ?? noop}
        onToggle={props.onToggle ?? (() => Promise.resolve())}
      />
    );

  afterEach(cleanup);

  it('should render entry text', () => {
    renderComponent();

    expect(screen.getByText(/mock text/i)).toBeInTheDocument();
  });

  it('should invoke `onSelect` callback when the list item is double clicked', async () => {
    const onSelect = vi.fn();

    renderComponent({ onSelect });

    await userEvent.pointer({
      keys: '[MouseLeft][MouseLeft]',
      target: screen.getByRole('listitem'),
    });

    expect(onSelect).toBeCalled();
  });

  it('should invoke `onToggle` callback when checkbox is clicked', async () => {
    const onToggle = vi.fn(() => Promise.resolve());

    renderComponent({ onToggle });

    await userEvent.click(screen.getByRole('checkbox'));

    expect(onToggle).toBeCalled();
  });

  it('should invoke `onDelete` callback when delete button is clicked', async () => {
    const onDelete = vi.fn(() => Promise.resolve());

    renderComponent({ onDelete });

    await userEvent.click(screen.getByTestId('delete-button'));

    expect(onDelete).toBeCalled();
  });
});
