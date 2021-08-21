import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React, { FunctionComponent } from 'react';

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
        Do you really want to delete all entries marked as done?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnAnswer(true)} color="default">
          Yes
        </Button>
        <Button onClick={handleOnAnswer(false)} color="default">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};
