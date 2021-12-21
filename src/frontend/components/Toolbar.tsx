import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import MuiToolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import React, { ChangeEvent, FunctionComponent } from 'react';

import { EntryType } from '../types';

export type ToolbarProps = {
  preferDarkMode: boolean;
  onAddEntry: () => void;
  onTabChange: (selectedTab: EntryType) => void;
  selectedTab: EntryType;
};

export const Toolbar: FunctionComponent<ToolbarProps> = ({
  preferDarkMode,
  onAddEntry,
  onTabChange,
  selectedTab,
}) => {
  const handleTabChange = (ev: ChangeEvent<unknown>, selectedTab: EntryType) =>
    onTabChange(selectedTab);

  return (
    <AppBar color={preferDarkMode ? 'default' : 'primary'} position="sticky">
      <MuiToolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ostoslista
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onAddEntry}>
          <AddIcon />
        </IconButton>
      </MuiToolbar>
      <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
        <Tab
          label="Todo"
          value="todo"
          icon={<CheckBoxOutlineBlankOutlinedIcon />}
        />
        <Tab label="Done" value="done" icon={<CheckBoxOutlinedIcon />} />
      </Tabs>
    </AppBar>
  );
};
