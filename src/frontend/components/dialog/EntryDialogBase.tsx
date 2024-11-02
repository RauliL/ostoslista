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
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { mutate } from 'swr';

export type EntryDialogValues = {
  text: string;
  url?: string;
};

export type EntryDialogBaseProps = {
  initialValues?: EntryDialogValues;
  onClose: () => void;
  onSubmit: (values: EntryDialogValues) => Promise<void>;
  open: boolean;
  title: ReactNode;
};

export const EntryDialogBase: FunctionComponent<EntryDialogBaseProps> = ({
  initialValues,
  onClose,
  onSubmit,
  open,
  title,
}) => {
  const [error, setError] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [url, setURL] = useState<string | undefined>();

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) =>
    setText(event.target.value);

  const handleURLChange = (event: ChangeEvent<HTMLInputElement>) =>
    setURL(event.target.value);

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();

    if (/^s\*$/.test(text)) {
      onClose();
      return;
    }

    return onSubmit({ text: text.trim(), url: url?.trim() })
      .then(async () => {
        setError(false);
        setText('');
        setURL(undefined);
        onClose();
        await mutate('entries');
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    setText(initialValues?.text ?? '');
    setURL(initialValues?.url);
  }, [initialValues]);

  return (
    <Dialog open={open} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {error && (
            <DialogContentText color="error">
              <FormattedMessage
                id="unableToSaveChanges"
                defaultMessage="Unable to save changes."
              />
            </DialogContentText>
          )}
          <TextField
            autoFocus
            label={<FormattedMessage id="text" defaultMessage="Text" />}
            fullWidth
            required
            value={text}
            onChange={handleTextChange}
            color="primary"
            style={{ paddingBottom: '1em' }}
          />
          <TextField
            type="url"
            label={<FormattedMessage id="url" defaultMessage="URL" />}
            fullWidth
            value={url}
            onChange={handleURLChange}
            color="primary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button type="submit" color="primary">
            <FormattedMessage id="add" defaultMessage="Add" />
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

EntryDialogBase.displayName = 'EntryDialogBase';
