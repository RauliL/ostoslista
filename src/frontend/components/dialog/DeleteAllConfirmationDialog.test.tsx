import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from 'lodash';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DeleteAllConfirmationDialog,
  DeleteAllConfirmationDialogProps,
} from './DeleteAllConfirmationDialog';

describe('<DeleteAllConfirmationDialog/>', () => {
  const renderComponent = (
    props: Partial<DeleteAllConfirmationDialogProps> = {}
  ) =>
    render(
      <IntlProvider locale="en">
        <DeleteAllConfirmationDialog
          onAnswer={props.onAnswer ?? noop}
          open={props.open ?? true}
        />
      </IntlProvider>
    );

  afterEach(cleanup);

  it('should invoke `onAnswer` callback with `true` if user clicks "Yes"-button', async () => {
    const onAnswer = vi.fn();

    renderComponent({ onAnswer });

    await userEvent.click(screen.getByRole('button', { name: /yes/i }));

    expect(onAnswer).toBeCalledWith(true);
  });

  it('should invoke `onAnswer` callback with `false` if user clicks "No"-button', async () => {
    const onAnswer = vi.fn();

    renderComponent({ onAnswer });

    await userEvent.click(screen.getByRole('button', { name: /no/i }));

    expect(onAnswer).toBeCalledWith(false);
  });
});
