import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { mutate } from 'swr';

import { Entry } from '../types';

export type EntryDialogBaseProps = {
  initialText?: string;
  onClose: () => void;
  onSubmit: (text: string) => Promise<Entry>;
  open: boolean;
  title: string;
};

export const EntryDialogBase: FunctionComponent<EntryDialogBaseProps> = ({
  initialText,
  onClose,
  onSubmit,
  open,
  title,
}) => {
  const [error, setError] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) =>
    setValue(ev.target.value);

  const handleSubmit = (ev: FormEvent) => {
    const text = value.trim();

    ev.preventDefault();

    if (text.length === 0) {
      onClose();
      return;
    }

    return onSubmit(text.trim())
      .then(async () => {
        setError(false);
        setValue('');
        onClose();
        await mutate('entries');
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    setValue(initialText ?? '');
  }, [initialText]);

  return (
    <Dialog open={open} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {error && (
            <DialogContentText color="error">
              Unable to save changes.
            </DialogContentText>
          )}
          <TextField
            autoFocus
            label="Text"
            fullWidth
            required
            value={value}
            onChange={handleChange}
            color="secondary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default">
            Cancel
          </Button>
          <Button type="submit" color="default">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
