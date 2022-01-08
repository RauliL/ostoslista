import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { mutate } from 'swr';

export type EntryDialogBaseProps = {
  initialText?: string;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
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
            color="primary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
