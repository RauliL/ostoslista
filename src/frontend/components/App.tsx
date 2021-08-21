import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { partition } from 'lodash';
import React, { FunctionComponent, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';

import { deleteEntry, getAllEntries, patchEntry } from '../api';
import { usePreferDarkMode } from '../hooks';
import { Entry, EntryType } from '../types';

import { Content } from './Content';
import { Toolbar } from './Toolbar';
import { AddEntryDialog, EditEntryDialog } from './dialog';
import { ErrorSnackbar } from './snackbar';

type AppState = {
  addEntryDialogOpen: boolean;
  editEntryDialogOpen: boolean;
  errorSnackbarOpen: boolean;
  selectedEntry?: Entry;
  selectedTab: EntryType;
  todoEntries: Entry[];
  doneEntries: Entry[];
};

export const App: FunctionComponent = () => {
  const { data, error } = useSWR('entries', getAllEntries);
  const [state, setState] = useState<AppState>({
    addEntryDialogOpen: false,
    editEntryDialogOpen: false,
    errorSnackbarOpen: false,
    selectedTab: 'todo',
    todoEntries: [],
    doneEntries: [],
  });
  const preferDarkMode = usePreferDarkMode();
  const theme = createMuiTheme({
    palette: { type: preferDarkMode ? 'dark' : 'light' },
  });

  const handleTabChange = (selectedTab: EntryType) => {
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
        console.error(err);
        setState((oldState) => ({
          ...oldState,
          errorSnackbarOpen: true,
        }));
      });

  const handleEntryDelete = (entry: Entry) =>
    deleteEntry(entry)
      .then(async () => {
        await mutate('entries');
      })
      .catch((err) => {
        console.error(err);
        setState((oldState) => ({
          ...oldState,
          errorSnackbarOpen: true,
        }));
      });

  const handleEntrySelect = (entry: Entry) =>
    setState((oldState) => ({
      ...oldState,
      editEntryDialogOpen: true,
      selectedEntry: entry,
    }));

  const handleDeleteAllDoneEntries = () =>
    state.doneEntries.length < 1
      ? Promise.resolve(undefined)
      : Promise.all(state.doneEntries.map(deleteEntry))
          .then(async () => {
            await mutate('entries');
          })
          .catch((err) => {
            console.error(err);
            setState((oldState) => ({
              ...oldState,
              errorSnackbarOpen: true,
            }));
          });

  const handleErrorSnackbarClose = () =>
    setState((oldState) => ({
      ...oldState,
      errorSnackbarOpen: false,
    }));

  useEffect(() => {
    if (error != null) {
      console.error(error);
      setState((oldState) => ({
        ...oldState,
        errorSnackbarOpen: true,
      }));
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toolbar
        preferDarkMode={preferDarkMode}
        onAddEntry={handleAddEntryButtonClick}
        onTabChange={handleTabChange}
        selectedTab={state.selectedTab}
      />
      <Content
        doneEntries={state.doneEntries}
        onDeleteAllDoneEntries={handleDeleteAllDoneEntries}
        onEntryDelete={handleEntryDelete}
        onEntrySelect={handleEntrySelect}
        onEntryToggle={handleEntryToggle}
        selectedTab={state.selectedTab}
        todoEntries={state.todoEntries}
      />
      <AddEntryDialog
        open={state.addEntryDialogOpen}
        onClose={handleAddEntryDialogClose}
      />
      <EditEntryDialog
        entry={state.selectedEntry}
        open={state.editEntryDialogOpen}
        onClose={handleEditEntryDialogClose}
      />
      <ErrorSnackbar
        onClose={handleErrorSnackbarClose}
        open={state.errorSnackbarOpen}
      />
    </ThemeProvider>
  );
};
