import List from '@material-ui/core/List';
import React, { FunctionComponent } from 'react';

import { Entry } from '../types';

import { DeleteAllEntriesListItem } from './DeleteAllEntriesListItem';
import { EntryListItem } from './EntryListItem';

export type EntryListProps = {
  entries: Entry[];
  onDeleteAllEntries?: () => Promise<void>;
  onEntryDelete: (entry: Entry) => Promise<void>;
  onEntrySelect: (entry: Entry) => void;
  onEntryToggle: (entry: Entry) => Promise<void>;
};

export const EntryList: FunctionComponent<EntryListProps> = ({
  entries,
  onDeleteAllEntries,
  onEntryDelete,
  onEntrySelect,
  onEntryToggle,
}) => (
  <List>
    {onDeleteAllEntries && entries.length > 0 && (
      <DeleteAllEntriesListItem onClick={onDeleteAllEntries} />
    )}
    {entries.map((entry) => (
      <EntryListItem
        key={entry.id}
        entry={entry}
        onDelete={() => onEntryDelete(entry)}
        onSelect={() => onEntrySelect(entry)}
        onToggle={() => onEntryToggle(entry)}
      />
    ))}
  </List>
);
