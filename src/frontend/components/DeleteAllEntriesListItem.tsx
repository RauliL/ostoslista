import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { FunctionComponent, useState } from 'react';

import { DeleteAllConfirmationDialog } from './dialog';

export type DeleteAllEntriesListItemProps = {
  onClick: () => Promise<void>;
};

export const DeleteAllEntriesListItem: FunctionComponent<DeleteAllEntriesListItemProps> = ({
  onClick,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(
    false
  );

  const handleClick = () => setConfirmationDialogOpen(true);

  const handleConfirmationAnswer = (answer: boolean) => {
    setConfirmationDialogOpen(false);
    if (!answer) {
      return;
    }
    setDisabled(true);
    onClick().finally(() => setDisabled(false));
  };

  return (
    <>
      <ListItem button onClick={handleClick} disabled={disabled}>
        <ListItemIcon>
          <IconButton onClick={handleClick} disabled={disabled}>
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText primary="Delete all" />
      </ListItem>
      <DeleteAllConfirmationDialog
        onAnswer={handleConfirmationAnswer}
        open={confirmationDialogOpen}
      />
    </>
  );
};
