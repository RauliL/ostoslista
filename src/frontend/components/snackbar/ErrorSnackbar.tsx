import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import React, { FunctionComponent, SyntheticEvent } from 'react';
import { FormattedMessage } from 'react-intl';

export type ErrorSnackbarProps = {
  onClose: () => void;
  open: boolean;
};

export const ErrorSnackbar: FunctionComponent<ErrorSnackbarProps> = ({
  onClose,
  open,
}) => {
  const handleClose = (event: Event | SyntheticEvent, reason?: string) => {
    if (reason !== 'clickaway') {
      onClose();
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert severity="error">
        <FormattedMessage
          id="apiError"
          defaultMessage="API returned erroneous response."
        />
      </Alert>
    </Snackbar>
  );
};

ErrorSnackbar.displayName = 'ErrorSnackbar';
