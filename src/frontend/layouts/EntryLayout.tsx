import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { FunctionComponent } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Outlet, useParams } from "react-router-dom";

import { TopBar } from "../components";
import { useEntry } from "../hooks";

export const EntryLayout: FunctionComponent = () => {
  const { id } = useParams();
  const { entry } = useEntry(id);
  const intl = useIntl();

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
        iconLabel={intl.formatMessage({
          id: "backToList",
          defaultMessage: "Back to list",
        })}
        to={entry?.done ? "/done" : "/todo"}
      />
      <Outlet />
    </>
  );
};

EntryLayout.displayName = "EntryLayout";
