import React, { FunctionComponent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { EntryList, LoadingScreen } from "./components";
import { useAuth } from "./context";
import { AdminLayout, EntryLayout, ListLayout } from "./layouts";
import { RequireAdmin, RequireAuth } from "./routes";
import {
  AddEntryView,
  CreateUserView,
  EditEntryView,
  LoginView,
  NotFoundView,
  UsersView,
} from "./views";

export const App: FunctionComponent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route index element={<Navigate to="/todo" replace />} />
      <Route
        element={
          <RequireAuth>
            <ListLayout />
          </RequireAuth>
        }
      >
        <Route path="todo" element={<EntryList type="todo" />} />
        <Route path="done" element={<EntryList type="done" />} />
      </Route>
      <Route
        element={
          <RequireAuth>
            <EntryLayout />
          </RequireAuth>
        }
      >
        <Route path="add" element={<AddEntryView />} />
        <Route path="edit/:id" element={<EditEntryView />} />
      </Route>
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<UsersView />} />
        <Route path="users/new" element={<CreateUserView />} />
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

App.displayName = "App";
