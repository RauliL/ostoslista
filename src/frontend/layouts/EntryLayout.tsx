import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";
import { Outlet, useParams } from "react-router-dom";

import { TopBar } from "../components";
import { useEntry } from "../hooks";

export const EntryLayout: FunctionComponent = () => {
  const { id } = useParams();
  const { entry } = useEntry(id);

  return (
    <>
      <TopBar
        title={
          id ? (
            <FormattedMessage id="editEntry" defaultMessage="Edit entry" />
          ) : (
            <FormattedMessage
              id="addNewEntry"
              defaultMessage="Add new entry"
            />
          )
        }
        icon={<ArrowBackIcon />}
        to={entry?.done ? "/done" : "/todo"}
      />
      <Outlet />
    </>
  );
};

EntryLayout.displayName = "EntryLayout";
