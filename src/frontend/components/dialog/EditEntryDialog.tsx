import React, { FunctionComponent } from 'react';

import { patchEntry } from '../../api';
import { SavedEntry } from '../../types';

import { EntryDialogBase, EntryDialogValues } from './EntryDialogBase';

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
  const handleSubmit = (values: EntryDialogValues): Promise<void> =>
    entry
      ? patchEntry(entry.id, {
          ...entry,
          text: values.text,
          url: values.url,
        }).then(() => undefined)
      : Promise.reject(new Error('No entry selected.'));

  return (
    <EntryDialogBase
      initialValues={{ text: entry?.text ?? '', url: entry?.url ?? undefined }}
      onClose={onClose}
      onSubmit={handleSubmit}
      open={open}
      title="Edit entry"
    />
  );
};

EditEntryDialog.displayName = 'EditEntryDialog';
