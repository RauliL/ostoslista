import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { FunctionComponent, useState } from 'react';

import { Entry } from '../types';

export type EntryListItemProps = {
  entry: Entry;
  onSelect: () => void;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
};

type EntryListItemButtons = {
  delete: boolean;
  toggle: boolean;
};

export const EntryListItem: FunctionComponent<EntryListItemProps> = ({
  entry,
  onDelete,
  onSelect,
  onToggle,
}) => {
  const [disabledButtons, setDisabledButtons] = useState<EntryListItemButtons>({
    delete: false,
    toggle: false,
  });

  const handleButtonClick = (
    callback: () => Promise<void>,
    key: keyof EntryListItemButtons
  ) => () => {
    setDisabledButtons((oldState) => ({
      ...oldState,
      [key]: true,
    }));

    callback().finally(() =>
      setDisabledButtons((oldState) => ({
        ...oldState,
        [key]: false,
      }))
    );
  };

  return (
    <ListItem button onDoubleClick={onSelect}>
      <ListItemIcon>
        <IconButton
          onClick={handleButtonClick(onToggle, 'toggle')}
          disabled={disabledButtons.toggle}
        >
          {entry.done ? (
            <CheckBoxOutlinedIcon />
          ) : (
            <CheckBoxOutlineBlankOutlinedIcon />
          )}
        </IconButton>
      </ListItemIcon>
      <ListItemText primary={entry.text} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={handleButtonClick(onDelete, 'delete')}
          disabled={disabledButtons.delete}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
