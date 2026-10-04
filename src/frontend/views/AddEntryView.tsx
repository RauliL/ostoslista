import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { createEntry } from "../api";
import { EntryForm, EntryFormValues } from "../components";

export const AddEntryView: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleCancel = () => navigate("/todo");

  const handleSubmit = (values: EntryFormValues) =>
    createEntry(values.text, values.url).then(handleCancel);

  return <EntryForm onCancel={handleCancel} onSubmit={handleSubmit} />;
};

AddEntryView.displayName = "AddEntryView";
