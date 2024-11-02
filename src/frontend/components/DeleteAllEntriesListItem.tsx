import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';

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
      <ListItemButton onClick={handleClick} disabled={disabled}>
        <ListItemIcon>
          <IconButton onClick={handleClick} disabled={disabled}>
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage id="deleteAll" defaultMessage="Delete all" />
          }
        />
      </ListItemButton>
      <DeleteAllConfirmationDialog
        onAnswer={handleConfirmationAnswer}
        open={confirmationDialogOpen}
      />
    </>
  );
};

DeleteAllEntriesListItem.displayName = 'DeleteAllEntriesListItem';
