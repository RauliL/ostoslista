import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";

type TopBarProps = {
  icon: ReactNode;
  iconLabel: string;
  title: ReactNode;
  to: string;
  actions?: ReactNode;
};

export const TopBar: FunctionComponent<TopBarProps> = ({
  icon,
  iconLabel,
  title,
  to,
  actions,
}) => (
  <AppBar position="sticky">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      {actions}
      <Tooltip title={iconLabel}>
        <IconButton
          edge="end"
          color="inherit"
          component={Link}
          to={to}
          aria-label={iconLabel}
        >
          {icon}
        </IconButton>
      </Tooltip>
    </Toolbar>
  </AppBar>
);

TopBar.displayName = "TopBar";
