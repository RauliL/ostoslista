import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import React, { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { TopBar } from "../components";
import { useAuth } from "../context";

export const ListLayout: FunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const { user, logout } = useAuth();

  const adminLabel = intl.formatMessage({
    id: "admin",
    defaultMessage: "Admin",
  });
  const signOutLabel = intl.formatMessage({
    id: "signOut",
    defaultMessage: "Sign out",
  });
  const addLabel = intl.formatMessage({
    id: "addNewEntry",
    defaultMessage: "Add new entry",
  });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <TopBar
        title="Ostoslista"
        icon={<AddIcon />}
        iconLabel={addLabel}
        to="/add"
        actions={
          <>
            {user?.isAdmin ? (
              <Tooltip title={adminLabel}>
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/admin/users"
                  aria-label={adminLabel}
                >
                  <AdminPanelSettingsIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            <Tooltip title={signOutLabel}>
              <IconButton
                color="inherit"
                onClick={handleLogout}
                aria-label={signOutLabel}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <Outlet />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation showLabels value={location.pathname}>
          <BottomNavigationAction
            component={Link}
            to="/todo"
            value="/todo"
            label="Todo"
            icon={<CheckBoxOutlineBlankOutlinedIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to="/done"
            value="/done"
            label="Done"
            icon={<CheckBoxOutlinedIcon />}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

ListLayout.displayName = "ListLayout";
