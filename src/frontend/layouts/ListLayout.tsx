import AddIcon from "@mui/icons-material/Add";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import React, { FunctionComponent } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { TopBar } from "../components";

export const ListLayout: FunctionComponent = () => {
  const location = useLocation();

  return (
    <>
      <TopBar title="Ostoslista" icon={<AddIcon />} to="/add" />
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
