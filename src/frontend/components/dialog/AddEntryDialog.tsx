import React, { FunctionComponent } from 'react';

import { createEntry } from '../../api';

import { EntryDialogBase, EntryDialogValues } from './EntryDialogBase';

export type AddEntryDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const AddEntryDialog: FunctionComponent<AddEntryDialogProps> = ({
  onClose,
  open,
}) => {
  const handleSubmit = (values: EntryDialogValues) =>
    createEntry(values.text, values.url).then(() => undefined);

  return (
    <EntryDialogBase
      onClose={onClose}
      onSubmit={handleSubmit}
      open={open}
      title="Add new entry"
    />
  );
};

AddEntryDialog.displayName = 'AddEntryDialog';
