import React, { FunctionComponent } from 'react';

import { patchEntry } from '../../api';
import { SavedEntry } from '../../types';

import { EntryDialogBase } from './EntryDialogBase';

export type EditEntryDialogProps = {
  entry?: SavedEntry;
  onClose: () => void;
  open: boolean;
};

export const EditEntryDialog: FunctionComponent<EditEntryDialogProps> = ({
  entry,
  onClose,
  open,
}) => {
  const handleSubmit = (text: string): Promise<void> =>
    entry
      ? patchEntry(entry.id, { ...entry, text }).then(() => undefined)
      : Promise.reject(new Error('No entry selected.'));

  return (
    <EntryDialogBase
      initialText={entry?.text ?? ''}
      onClose={onClose}
      onSubmit={handleSubmit}
      open={open}
      title="Edit entry"
    />
  );
};
