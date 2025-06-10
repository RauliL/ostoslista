import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from 'lodash';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AddEntryDialog, AddEntryDialogProps } from './AddEntryDialog';

describe('<AddEntryDialog/>', () => {
  const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });
  const renderComponent = (props: Partial<AddEntryDialogProps> = {}) =>
    render(
      <IntlProvider locale="en">
        <AddEntryDialog
          onClose={props.onClose ?? noop}
          open={props.open ?? true}
        />
      </IntlProvider>
    );

  afterEach(() => {
    cleanup();
    mock.reset();
  });

  it('should invoke `onClose` callback when closed', async () => {
    const onClose = vi.fn();

    renderComponent({ onClose });

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toBeCalled();
  });

  it('should create new entry when add button is clicked', async () => {
    renderComponent();

    await userEvent.type(
      screen.getByRole('textbox', { name: /text/i }),
      'test'
    );
    await userEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(mock.history).toHaveLength(1);
    expect(mock.history[0]).toMatchObject({ method: 'post', url: '/api' });
  });
});
