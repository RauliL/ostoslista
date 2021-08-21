import Container from '@material-ui/core/Container';
import React, { FunctionComponent } from 'react';

import { Entry, EntryType } from '../types';

import { EntryList } from './EntryList';

export type ContentProps = {
  doneEntries: Entry[];
  onDeleteAllDoneEntries: () => Promise<void>;
  onEntryDelete: (entry: Entry) => Promise<void>;
  onEntrySelect: (entry: Entry) => void;
  onEntryToggle: (entry: Entry) => Promise<void>;
  selectedTab: EntryType;
  todoEntries: Entry[];
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
