import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";

type TopBarProps = {
  icon: ReactNode;
  title: ReactNode;
  to: string;
};

export const TopBar: FunctionComponent<TopBarProps> = ({
  icon,
  title,
  to,
}) => (
  <AppBar position="sticky">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      <IconButton edge="end" color="inherit" component={Link} to={to}>
        {icon}
      </IconButton>
    </Toolbar>
  </AppBar>
);

TopBar.displayName = "TopBar";
