import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/PreviewOutlined';
import React, { FunctionComponent, useState } from 'react';

import { SavedEntry } from '../types';

export type EntryListItemProps = {
  entry: SavedEntry;
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

  const handleButtonClick =
    (callback: () => Promise<void>, key: keyof EntryListItemButtons) => () => {
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
    <ListItemButton onDoubleClick={onSelect} role="listitem">
      <ListItemIcon>
        <IconButton
          onClick={handleButtonClick(onToggle, 'toggle')}
          disabled={disabledButtons.toggle}
          role="checkbox"
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
        {entry.url && (
          <IconButton
            edge="end"
            aria-label="open"
            onClick={() => window.open(entry.url!, '_blank')}
            data-testid="open-button"
          >
            <PreviewIcon />
          </IconButton>
        )}
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={handleButtonClick(onDelete, 'delete')}
          disabled={disabledButtons.delete}
          data-testid="delete-button"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

EntryListItem.displayName = 'EntryListItem';
