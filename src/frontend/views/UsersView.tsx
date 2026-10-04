import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { PublicUser } from "express-varasto-jwt-auth";
import React, { FunctionComponent, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import { deleteUser, listUsers } from "../authApi";
import { ApiError } from "../authToken";
import { useAuth } from "../context";

export const UsersView: FunctionComponent = () => {
  const intl = useIntl();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    setError(null);

    try {
      const response = await listUsers();

      setUsers(response.users);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : intl.formatMessage({
              id: "loadUsersFailed",
              defaultMessage: "Unable to load users.",
            }),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, [intl]);

  async function handleDelete(user: PublicUser) {
    if (
      !window.confirm(
        intl.formatMessage(
          {
            id: "deleteUserConfirm",
            defaultMessage: "Delete user {username}?",
          },
          { username: user.username },
        ),
      )
    ) {
      return;
    }

    try {
      await deleteUser(user.username);
      setUsers((current) =>
        current.filter((entry) => entry.username !== user.username),
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : intl.formatMessage({
              id: "deleteUserFailed",
              defaultMessage: "Unable to delete user.",
            }),
      );
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
          <FormattedMessage id="users" defaultMessage="Users" />
        </Typography>
        <Button
          component={RouterLink}
          to="/admin/users/new"
          variant="contained"
        >
          <FormattedMessage id="createUser" defaultMessage="Create user" />
        </Button>
      </Box>
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="username" defaultMessage="Username" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="role" defaultMessage="Role" />
                </TableCell>
                <TableCell align="right">
                  <FormattedMessage id="actions" defaultMessage="Actions" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.isAdmin
                          ? intl.formatMessage({
                              id: "roleAdministrator",
                              defaultMessage: "Administrator",
                            })
                          : intl.formatMessage({
                              id: "roleUser",
                              defaultMessage: "User",
                            })
                      }
                      color={user.isAdmin ? "primary" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {user.username !== currentUser?.username ? (
                      <IconButton
                        aria-label={intl.formatMessage(
                          {
                            id: "deleteUserAria",
                            defaultMessage: "Delete {username}",
                          },
                          { username: user.username },
                        )}
                        color="error"
                        onClick={() => void handleDelete(user)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

UsersView.displayName = "UsersView";
