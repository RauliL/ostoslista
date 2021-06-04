import List from '@material-ui/core/List';
import React, { FunctionComponent } from 'react';

import { Entry } from '../types';

import { EntryListItem } from './EntryListItem';

export type EntryListProps = {
  entries: Entry[];
  onEntryDelete: (entry: Entry) => Promise<void>;
  onEntrySelect: (entry: Entry) => void;
  onEntryToggle: (entry: Entry) => Promise<void>;
};

export const EntryList: FunctionComponent<EntryListProps> = ({
  entries,
  onEntryDelete,
  onEntrySelect,
  onEntryToggle,
}) => (
  <List>
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
