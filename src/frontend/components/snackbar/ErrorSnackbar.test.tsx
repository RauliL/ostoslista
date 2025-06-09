import { noop } from 'lodash';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { afterEach, describe, expect, it } from 'vitest';
import { ErrorSnackbar, ErrorSnackbarProps } from './ErrorSnackbar';

describe('<ErrorSnackbar/>', () => {
  const renderComponent = (props: Partial<ErrorSnackbarProps> = {}) =>
    render(
      <IntlProvider locale="en">
        <ErrorSnackbar
          onClose={props.onClose ?? noop}
          open={props.open ?? true}
        />
      </IntlProvider>
    );

  afterEach(cleanup);

  it('should render text "API returned erroneous response."', () => {
    renderComponent();

    expect(
      screen.getByText(/api returned erroneous response/i)
    ).toBeInTheDocument();
  });
});
