import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React, { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

type LoadingScreenProps = {
  message?: string;
};

export const LoadingScreen: FunctionComponent<LoadingScreenProps> = ({
  message,
}) => (
  <Box
    sx={{
      display: "grid",
      placeItems: "center",
      minHeight: "100vh",
      gap: 2,
    }}
  >
    <CircularProgress />
    <Typography color="text.secondary">
      {message ?? <FormattedMessage id="loading" defaultMessage="Loading…" />}
    </Typography>
  </Box>
);

LoadingScreen.displayName = "LoadingScreen";
