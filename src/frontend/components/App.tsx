import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import { partition } from 'lodash';
import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import useSWR, { mutate } from 'swr';

import { deleteEntry, getAllEntries, patchEntry } from '../api';
import { Entry } from '../types';

import { AddEntryDialog } from './AddEntryDialog';
import { EditEntryDialog } from './EditEntryDialog';
import { EntryList } from './EntryList';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
  },
}));

type TabId = 'todo' | 'done';

type AppState = {
  addEntryDialogOpen: boolean;
  editEntryDialogOpen: boolean;
  selectedEntry?: Entry;
  selectedTab: TabId;
  todoEntries: Entry[];
  doneEntries: Entry[];
};

export const App: FunctionComponent = () => {
  const classes = useStyles();
  const { data, error } = useSWR('entries', getAllEntries);
  const [state, setState] = useState<AppState>({
    addEntryDialogOpen: false,
    editEntryDialogOpen: false,
    selectedTab: 'todo',
    todoEntries: [],
    doneEntries: [],
  });

  const handleTabChange = (event: ChangeEvent<{}>, selectedTab: TabId) => {
    setState((oldState) => ({
      ...oldState,
      selectedTab,
    }));
  };

  const handleAddEntryButtonClick = () => {
    setState((oldState) => ({
      ...oldState,
      addEntryDialogOpen: true,
    }));
  };

  const handleAddEntryDialogClose = () => {
    setState((oldState) => ({
      ...oldState,
      addEntryDialogOpen: false,
    }));
  };

  const handleEditEntryDialogClose = () => {
    setState((oldState) => ({
      ...oldState,
      editEntryDialogOpen: false,
    }));
  };

  const handleEntryToggle = (entry: Entry) =>
    patchEntry({ ...entry, done: !entry.done })
      .then(async () => {
        await mutate('entries');
      })
      .catch((err) => {
        // TODO: Display an error message to the user as well.
        console.error(err);
      });

  const handleEntryDelete = (entry: Entry) =>
    deleteEntry(entry)
      .then(async () => {
        await mutate('entries');
      })
      .catch((err) => {
        // TODO: Display an error message to the user as well.
        console.error(err);
      });

  const handleEntrySelect = (entry: Entry) =>
    setState((oldState) => ({
      ...oldState,
      editEntryDialogOpen: true,
      selectedEntry: entry,
    }));

  useEffect(() => {
    if (error != null) {
      // TODO: Display an error message to the user as well.
      console.error(error);
    }

    if (data != null) {
      const [doneEntries, todoEntries] = partition(data, 'done');

      setState((oldState) => ({
        ...oldState,
        todoEntries,
        doneEntries,
      }));
    }
  }, [data, error]);

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Ostoslista
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleAddEntryButtonClick}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
        <Tabs
          value={state.selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab
            label="Todo"
            value="todo"
            icon={<CheckBoxOutlineBlankOutlinedIcon />}
          />
          <Tab label="Done" value="done" icon={<CheckBoxOutlinedIcon />} />
        </Tabs>
      </AppBar>
      <Container>
        <div hidden={state.selectedTab !== 'todo'}>
          <EntryList
            entries={state.todoEntries}
            onEntryDelete={handleEntryDelete}
            onEntrySelect={handleEntrySelect}
            onEntryToggle={handleEntryToggle}
          />
        </div>
        <div hidden={state.selectedTab !== 'done'}>
          <EntryList
            entries={state.doneEntries}
            onEntryDelete={handleEntryDelete}
            onEntrySelect={handleEntrySelect}
            onEntryToggle={handleEntryToggle}
          />
        </div>
      </Container>
      <AddEntryDialog
        open={state.addEntryDialogOpen}
        onClose={handleAddEntryDialogClose}
      />
      <EditEntryDialog
        entry={state.selectedEntry}
        open={state.editEntryDialogOpen}
        onClose={handleEditEntryDialogClose}
      />
    </>
  );
};
