import AddIcon from "@mui/icons-material/Add";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import AppBar from "@mui/material/AppBar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, {
  FunctionComponent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { mutate } from "swr";

import { deleteEntry, patchEntry } from "../api";
import { useAllEntries } from "../hooks";
import { EntryType, SavedEntry } from "../types";

import { Content } from "./Content";
import { AddEntryDialog, EditEntryDialog } from "./dialog";
import { ErrorSnackbar } from "./snackbar";

export const App: FunctionComponent = () => {
  const { todoEntries, doneEntries, error } = useAllEntries();
  const [selectedTab, setSelectedTab] = useState<EntryType>("todo");
  const [addEntryDialogOpen, setAddEntryDialogOpen] = useState(false);
  const [editEntryDialogOpen, setEditEntryDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<SavedEntry | undefined>(
    undefined,
  );
  const [showError, setShowError] = useState(false);

  const handleTabChange = (event: SyntheticEvent, selectedTab: EntryType) => {
    setSelectedTab(selectedTab);
  };

  const handleAddEntryButtonClick = () => {
    setAddEntryDialogOpen(true);
  };

  const handleAddEntryDialogClose = () => {
    setAddEntryDialogOpen(false);
  };

  const handleEditEntryDialogClose = () => {
    setEditEntryDialogOpen(false);
  };

  const handleEntryToggle = (entry: SavedEntry) =>
    patchEntry(entry.id, { ...entry, done: !entry.done })
      .then(() => mutate("entries"))
      .catch((err) => {
        console.error(err);
        setShowError(true);
      });

  const handleEntryDelete = (entry: SavedEntry) =>
    deleteEntry(entry.id)
      .then(() => mutate("entries"))
      .catch((err) => {
        console.error(err);
        setShowError(true);
      });

  const handleEntrySelect = (entry: SavedEntry) => {
    setEditEntryDialogOpen(true);
    setSelectedEntry(entry);
  };

  const handleDeleteAllDoneEntries = () =>
    doneEntries.length < 1
      ? Promise.resolve(undefined)
      : Promise.all(doneEntries.map((entry) => deleteEntry(entry.id)))
          .then(() => mutate("entries"))
          .catch((err) => {
            console.error(err);
            setShowError(true);
          });

  const handleErrorSnackbarClose = () => {
    setShowError(false);
  };

  useEffect(() => {
    if (error != null) {
      console.error(error);
      setShowError(true);
    }
  }, [error]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
      </AppBar>
      <Content
        doneEntries={doneEntries}
        onDeleteAllDoneEntries={handleDeleteAllDoneEntries}
        onEntryDelete={handleEntryDelete}
        onEntrySelect={handleEntrySelect}
        onEntryToggle={handleEntryToggle}
        selectedTab={selectedTab}
        todoEntries={todoEntries}
      />
      <AddEntryDialog
        open={addEntryDialogOpen}
        onClose={handleAddEntryDialogClose}
      />
      <EditEntryDialog
        entry={selectedEntry}
        open={editEntryDialogOpen}
        onClose={handleEditEntryDialogClose}
      />
      <ErrorSnackbar onClose={handleErrorSnackbarClose} open={showError} />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={selectedTab}
          onChange={handleTabChange}
        >
          <BottomNavigationAction
            label="Todo"
            icon={<CheckBoxOutlineBlankOutlinedIcon />}
            value="todo"
          />
          <BottomNavigationAction
            label="Done"
            icon={<CheckBoxOutlinedIcon />}
            value="done"
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

App.displayName = "App";
