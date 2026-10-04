import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { FunctionComponent, SubmitEvent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useAuth } from "../context";

export const LoginForm: FunctionComponent = () => {
  const { login, error, clearError } = useAuth();
  const intl = useIntl();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();
    setSubmitting(true);

    // Uncontrolled fields + FormData so browser autofill is included on submit.
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await login({ username, password });
    } catch {
      // Error state is handled in AuthContext.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography component="h1" variant="h5" gutterBottom>
        <FormattedMessage id="signIn" defaultMessage="Sign in" />
      </Typography>
      <TextField
        id="username"
        name="username"
        label={intl.formatMessage({
          id: "username",
          defaultMessage: "Username",
        })}
        autoFocus
        autoComplete="username"
        margin="normal"
        required
        fullWidth
      />
      <TextField
        id="password"
        name="password"
        label={intl.formatMessage({
          id: "password",
          defaultMessage: "Password",
        })}
        type="password"
        autoComplete="current-password"
        margin="normal"
        required
        fullWidth
      />
      {error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : null}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={submitting}
        sx={{ mt: 3 }}
      >
        {submitting ? (
          <FormattedMessage id="signingIn" defaultMessage="Signing in…" />
        ) : (
          <FormattedMessage id="signIn" defaultMessage="Sign in" />
        )}
      </Button>
    </Box>
  );
};

LoginForm.displayName = "LoginForm";
