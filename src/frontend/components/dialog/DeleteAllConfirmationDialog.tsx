import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

export type DeleteAllConfirmationDialogProps = {
  onAnswer: (answer: boolean) => void;
  open: boolean;
};

export const DeleteAllConfirmationDialog: FunctionComponent<DeleteAllConfirmationDialogProps> = ({
  onAnswer,
  open,
}) => {
  const handleOnAnswer = (answer: boolean) => () => onAnswer(answer);

  return (
    <Dialog open={open} fullWidth>
      <DialogContent>
        <FormattedMessage
          id="deleteAllConfirmation"
          defaultMessage="Do you really want to delete all entries marked as done?"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnAnswer(true)} color="primary">
          <FormattedMessage id="yes" defaultMessage="Yes" />
        </Button>
        <Button onClick={handleOnAnswer(false)} color="primary">
          <FormattedMessage id="no" defaultMessage="No" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteAllConfirmationDialog.displayName = 'DeleteAllConfirmationDialog';
