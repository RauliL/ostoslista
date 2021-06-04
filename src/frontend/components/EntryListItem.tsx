import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
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
    <ListItem onDoubleClick={onSelect}>
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
