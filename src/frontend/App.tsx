import React, { FunctionComponent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { EntryList } from "./components";
import { EntryLayout, ListLayout } from "./layouts";
import { AddEntryView, EditEntryView, NotFoundView } from "./views";

export const App: FunctionComponent = () => (
  <Routes>
    <Route index element={<Navigate to="/todo" replace />} />
    <Route element={<ListLayout />}>
      <Route path="todo" element={<EntryList type="todo" />} />
      <Route path="done" element={<EntryList type="done" />} />
    </Route>
    <Route element={<EntryLayout />}>
      <Route path="add" element={<AddEntryView />} />
      <Route path="edit/:id" element={<EditEntryView />} />
    </Route>
    <Route path="*" element={<NotFoundView />} />
  </Routes>
);

App.displayName = "App";
