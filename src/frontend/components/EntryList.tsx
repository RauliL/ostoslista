import Container from "@mui/material/Container";
import List from "@mui/material/List";
import React, { FunctionComponent, useEffect, useState } from "react";
import { mutate } from "swr";

import { deleteEntry, patchEntry } from "../api";
import { useAllEntries } from "../hooks";
import { EntryType, SavedEntry } from "../types";
import { DeleteAllEntriesListItem } from "./DeleteAllEntriesListItem";
import { EntryListItem } from "./EntryListItem";
import { ErrorSnackbar } from "./ErrorSnackbar";

export type EntryListProps = {
  type: EntryType;
};

export const EntryList: FunctionComponent<EntryListProps> = ({ type }) => {
  const { todoEntries, doneEntries, error } = useAllEntries();
  const entries = type === "todo" ? todoEntries : doneEntries;
  const [showError, setShowError] = useState(false);

  const handleError = (err: Error) => {
    console.error(err);
    setShowError(true);
  };

  const handleDelete = (entry: SavedEntry) => (): Promise<void> =>
    deleteEntry(entry.id)
      .then(() => mutate("entries"))
      .catch(handleError);

  const handleDeleteAll = (): Promise<void> =>
    doneEntries.length < 1
      ? Promise.resolve(undefined)
      : Promise.all(doneEntries.map((entry) => deleteEntry(entry.id)))
          .then(() => mutate("entries"))
          .catch(handleError);

  const handleToggle = (entry: SavedEntry) => (): Promise<void> =>
    patchEntry(entry.id, { ...entry, done: !entry.done })
      .then(() => mutate("entries"))
      .catch(handleError);

  const handleErrorSnackbarClose = () => {
    setShowError(false);
  };

  useEffect(() => {
    if (error != null) {
      handleError(error);
    }
  }, [error]);

  return (
    <>
      <Container>
        <List>
          {type === "done" && entries.length > 0 && (
            <DeleteAllEntriesListItem onClick={handleDeleteAll} />
          )}
          {entries.map((entry) => (
            <EntryListItem
              key={entry.id}
              entry={entry}
              onDelete={handleDelete(entry)}
              onToggle={handleToggle(entry)}
            />
          ))}
        </List>
      </Container>
      <ErrorSnackbar onClose={handleErrorSnackbarClose} open={showError} />
    </>
  );
};

EntryList.displayName = "EntryList";
