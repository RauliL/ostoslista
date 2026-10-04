import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { FormEvent, FunctionComponent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { createUser } from "../authApi";
import { ApiError } from "../authToken";

export const CreateUserView: FunctionComponent = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createUser({ username, password, isAdmin });
      navigate("/admin/users");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : intl.formatMessage({
              id: "createUserFailed",
              defaultMessage: "Unable to create user.",
            }),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography component="h1" variant="h5">
          <FormattedMessage id="createUser" defaultMessage="Create user" />
        </Typography>
        <Button component={RouterLink} to="/admin/users" variant="outlined">
          <FormattedMessage id="backToUsers" defaultMessage="Back to users" />
        </Button>
      </Box>
      <Paper sx={{ p: 3, maxWidth: 480 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="new-username"
            label={intl.formatMessage({
              id: "username",
              defaultMessage: "Username",
            })}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            margin="normal"
            required
            fullWidth
          />
          <TextField
            id="new-password"
            label={intl.formatMessage({
              id: "password",
              defaultMessage: "Password",
            })}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            margin="normal"
            required
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                id="new-is-admin"
                checked={isAdmin}
                onChange={(event) => setIsAdmin(event.target.checked)}
              />
            }
            label={intl.formatMessage({
              id: "administrator",
              defaultMessage: "Administrator",
            })}
            sx={{ mt: 1 }}
          />
          {error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : null}
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ mt: 3 }}
          >
            {submitting ? (
              <FormattedMessage
                id="creatingUser"
                defaultMessage="Creating user…"
              />
            ) : (
              <FormattedMessage id="createUser" defaultMessage="Create user" />
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

CreateUserView.displayName = "CreateUserView";
