import List from '@mui/material/List';
import React, { FunctionComponent } from 'react';

import { SavedEntry } from '../types';

import { DeleteAllEntriesListItem } from './DeleteAllEntriesListItem';
import { EntryListItem } from './EntryListItem';

export type EntryListProps = {
  entries: SavedEntry[];
  onDeleteAllEntries?: () => Promise<void>;
  onEntryDelete: (entry: SavedEntry) => Promise<void>;
  onEntrySelect: (entry: SavedEntry) => void;
  onEntryToggle: (entry: SavedEntry) => Promise<void>;
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

EntryList.displayName = 'EntryList';
