import React, { FunctionComponent } from 'react';

import { createEntry } from '../api';

import { EntryDialogBase } from './EntryDialogBase';

export type AddEntryDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const AddEntryDialog: FunctionComponent<AddEntryDialogProps> = ({
  onClose,
  open,
}) => {
  const handleSubmit = (text: string) => createEntry(text);

  return (
    <EntryDialogBase
      onClose={onClose}
      onSubmit={handleSubmit}
      open={open}
      title="Add new entry"
    />
  );
};
