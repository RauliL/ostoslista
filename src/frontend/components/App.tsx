import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { mutate } from 'swr';

import { deleteEntry, patchEntry } from '../api';
import { useAllEntries, usePreferDarkMode } from '../hooks';
import { EntryType, SavedEntry } from '../types';

import { Content } from './Content';
import { Toolbar } from './Toolbar';
import { AddEntryDialog, EditEntryDialog } from './dialog';
import { ErrorSnackbar } from './snackbar';

type AppState = {
  addEntryDialogOpen: boolean;
  editEntryDialogOpen: boolean;
  errorSnackbarOpen: boolean;
  selectedEntry?: SavedEntry;
  selectedTab: EntryType;
};

export const App: FunctionComponent = () => {
  const { todoEntries, doneEntries, error } = useAllEntries();
  const [state, setState] = useState<AppState>({
    addEntryDialogOpen: false,
    editEntryDialogOpen: false,
    errorSnackbarOpen: false,
    selectedTab: 'todo',
  });
  const preferDarkMode = usePreferDarkMode();
  const theme = createTheme({
    palette: { mode: preferDarkMode ? 'dark' : 'light' },
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

  const handleEntryToggle = (entry: SavedEntry) =>
    patchEntry(entry.id, { ...entry, done: !entry.done })
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

  const handleEntryDelete = (entry: SavedEntry) =>
    deleteEntry(entry.id)
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

  const handleEntrySelect = (entry: SavedEntry) =>
    setState((oldState) => ({
      ...oldState,
      editEntryDialogOpen: true,
      selectedEntry: entry,
    }));

  const handleDeleteAllDoneEntries = () =>
    doneEntries.length < 1
      ? Promise.resolve(undefined)
      : Promise.all(doneEntries.map((entry) => deleteEntry(entry.id)))
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
  }, [error]);

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
        doneEntries={doneEntries}
        onDeleteAllDoneEntries={handleDeleteAllDoneEntries}
        onEntryDelete={handleEntryDelete}
        onEntrySelect={handleEntrySelect}
        onEntryToggle={handleEntryToggle}
        selectedTab={state.selectedTab}
        todoEntries={todoEntries}
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
