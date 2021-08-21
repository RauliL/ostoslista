import Container from '@material-ui/core/Container';
import React, { FunctionComponent } from 'react';

import { Entry, EntryType } from '../types';

import { EntryList } from './EntryList';

export type ContentProps = {
  doneEntries: Entry[];
  onEntryDelete: (entry: Entry) => Promise<void>;
  onEntrySelect: (entry: Entry) => void;
  onEntryToggle: (entry: Entry) => Promise<void>;
  selectedTab: EntryType;
  todoEntries: Entry[];
};

export const Content: FunctionComponent<ContentProps> = ({
  doneEntries,
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
        onEntryDelete={onEntryDelete}
        onEntrySelect={onEntrySelect}
        onEntryToggle={onEntryToggle}
      />
    </div>
  </Container>
);
