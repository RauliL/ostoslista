import Container from '@mui/material/Container';
import React, { FunctionComponent } from 'react';

import { EntryType, SavedEntry } from '../types';

import { EntryList } from './EntryList';

export type ContentProps = {
  doneEntries: SavedEntry[];
  onDeleteAllDoneEntries: () => Promise<void>;
  onEntryDelete: (entry: SavedEntry) => Promise<void>;
  onEntrySelect: (entry: SavedEntry) => void;
  onEntryToggle: (entry: SavedEntry) => Promise<void>;
  selectedTab: EntryType;
  todoEntries: SavedEntry[];
};

export const Content: FunctionComponent<ContentProps> = ({
  doneEntries,
  onDeleteAllDoneEntries,
  onEntryDelete,
  onEntrySelect,
  onEntryToggle,
  selectedTab,
  todoEntries,
}) => (
  <Container>
    <div hidden={selectedTab !== 'todo'}>
      <EntryList
        entries={todoEntries}
        onEntryDelete={onEntryDelete}
        onEntrySelect={onEntrySelect}
        onEntryToggle={onEntryToggle}
      />
    </div>
    <div hidden={selectedTab !== 'done'}>
      <EntryList
        entries={doneEntries}
        onDeleteAllEntries={onDeleteAllDoneEntries}
        onEntryDelete={onEntryDelete}
        onEntrySelect={onEntrySelect}
        onEntryToggle={onEntryToggle}
      />
    </div>
  </Container>
);
