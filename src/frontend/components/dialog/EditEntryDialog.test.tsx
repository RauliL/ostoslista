import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { noop } from 'lodash';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditEntryDialog, EditEntryDialogProps } from './EditEntryDialog';
import { IntlProvider } from 'react-intl';

describe('<EditEntryDialog/>', () => {
  const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });
  const renderComponent = (props: Partial<EditEntryDialogProps> = {}) =>
    render(
      <IntlProvider locale="en">
        <EditEntryDialog
          entry={props.entry}
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

  it('should patch existing entry when add button is clicked', async () => {
    renderComponent({
      entry: {
        id: '1d0245a0-45c3-11f0-a39a-0342ed515660',
        text: 'foo',
        done: false,
      },
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: /text/i }),
      'test'
    );
    await userEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(mock.history).toHaveLength(1);
    expect(mock.history[0]).toMatchObject({
      method: 'patch',
      url: '/api/1d0245a0-45c3-11f0-a39a-0342ed515660',
    });
  });
});
