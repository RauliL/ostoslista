import React, { FunctionComponent } from 'react';

import { patchEntry } from '../../api';
import { Entry } from '../../types';

import { EntryDialogBase } from './EntryDialogBase';

export type EditEntryDialogProps = {
  entry?: Entry;
  onClose: () => void;
  open: boolean;
};

export const EditEntryDialog: FunctionComponent<EditEntryDialogProps> = ({
  entry,
  onClose,
  open,
}) => {
  const handleSubmit = (text: string): Promise<Entry> =>
    entry
      ? patchEntry({ ...entry, text })
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
