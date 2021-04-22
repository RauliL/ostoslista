import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { FunctionComponent } from 'react';

import { Entry } from '../types';

export type EntryListItemProps = {
  entry: Entry;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export const EntryListItem: FunctionComponent<EntryListItemProps> = ({
  entry,
  onDelete,
  onSelect,
  onToggle,
}) => (
  <ListItem onDoubleClick={onSelect}>
    <ListItemIcon>
      <IconButton onClick={onToggle}>
        {entry.done ? (
          <CheckBoxOutlinedIcon />
        ) : (
          <CheckBoxOutlineBlankOutlinedIcon />
        )}
      </IconButton>
    </ListItemIcon>
    <ListItemText primary={entry.text} />
    <ListItemSecondaryAction>
      <IconButton edge="end" aria-label="delete" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);
