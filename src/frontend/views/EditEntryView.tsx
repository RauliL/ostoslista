import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import React, { FunctionComponent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { patchEntry } from "../api";
import { EntryForm, EntryFormValues } from "../components";
import { useEntry } from "../hooks";
import { NotFoundView } from "./NotFoundView";

export const EditEntryView: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { entry, isLoading } = useEntry(id);
  const navigate = useNavigate();

  const handleCancel = () => navigate(entry?.done ? "/done" : "/todo");

  const handleSubmit = ({ text, url }: EntryFormValues) =>
    entry
      ? patchEntry(entry.id, { ...entry, text, url }).then(handleCancel)
      : Promise.reject(new Error("Entry not found"));

  if (isLoading) {
    return (
      <Container sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <CircularProgress aria-label="Loading" />
      </Container>
    );
  }

  if (!entry) {
    return <NotFoundView />;
  }

  return (
    <EntryForm
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      initialValues={entry}
    />
  );
};

EditEntryView.displayName = "EditEntryView";
