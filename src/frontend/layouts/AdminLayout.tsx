import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { FunctionComponent } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context";

export const AdminLayout: FunctionComponent = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const intl = useIntl();

  const backToListLabel = intl.formatMessage({
    id: "backToList",
    defaultMessage: "Back to list",
  });
  const signOutLabel = intl.formatMessage({
    id: "signOut",
    defaultMessage: "Sign out",
  });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Tooltip title={backToListLabel}>
            <IconButton
              edge="start"
              color="inherit"
              component={Link}
              to="/todo"
              aria-label={backToListLabel}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="admin" defaultMessage="Admin" />
          </Typography>
          <Tooltip title={signOutLabel}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleLogout}
              aria-label={signOutLabel}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
};

AdminLayout.displayName = "AdminLayout";
