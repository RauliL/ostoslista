import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import MuiToolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import React, { ChangeEvent, FunctionComponent } from 'react';

import { EntryType } from '../types';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
  },
}));

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
  const classes = useStyles();
  const handleTabChange = (ev: ChangeEvent<unknown>, selectedTab: EntryType) =>
    onTabChange(selectedTab);

  return (
    <AppBar color={preferDarkMode ? 'default' : 'primary'} position="sticky">
      <MuiToolbar>
        <Typography variant="h6" className={classes.title}>
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
