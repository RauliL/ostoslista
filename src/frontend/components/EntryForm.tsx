import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React, {
  ChangeEvent,
  FunctionComponent,
  SubmitEvent,
  useState,
} from "react";
import { FormattedMessage } from "react-intl";

import { Entry } from "../types";
import { ErrorSnackbar } from "./ErrorSnackbar";

export type EntryFormValues = Pick<Entry, "text" | "url">;

export type EntryFormProps = {
  initialValues?: EntryFormValues;
  onCancel: () => void;
  onSubmit: (entry: EntryFormValues) => Promise<void>;
};

export const EntryForm: FunctionComponent<EntryFormProps> = ({
  initialValues,
  onCancel,
  onSubmit,
}) => {
  const [text, setText] = useState<string | undefined>(initialValues?.text);
  const [url, setUrl] = useState<string | undefined>(
    initialValues?.url ?? undefined,
  );
  const [showError, setShowError] = useState<boolean>(false);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text) {
      onSubmit({ text, url })
        .then(() => setShowError(false))
        .catch(() => setShowError(true));
    }
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) =>
    setText(event.target.value);

  const handleURLChange = (event: ChangeEvent<HTMLInputElement>) =>
    setUrl(event.target.value);

  return (
    <>
      <Container sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              autoFocus
              label={<FormattedMessage id="text" defaultMessage="Text" />}
              fullWidth
              required
              value={text ?? ""}
              onChange={handleTextChange}
              color="primary"
            />
            <TextField
              type="url"
              label={<FormattedMessage id="url" defaultMessage="URL" />}
              fullWidth
              value={url ?? ""}
              onChange={handleURLChange}
              color="primary"
            />
            <ButtonGroup sx={{ alignSelf: "center" }}>
              <Button
                onClick={onCancel}
                color="primary"
                startIcon={<CancelIcon />}
              >
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
              <Button type="submit" color="primary" startIcon={<AddIcon />}>
                <FormattedMessage id="add" defaultMessage="Add" />
              </Button>
            </ButtonGroup>
          </Stack>
        </form>
      </Container>
      <ErrorSnackbar open={showError} onClose={() => setShowError(false)} />
    </>
  );
};

EntryForm.displayName = "EntryForm";
