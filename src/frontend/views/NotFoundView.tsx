import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React, { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

export const NotFoundView: FunctionComponent = () => (
  <Container sx={{ mt: 2 }}>
    <Typography variant="h5" component="h1">
      <FormattedMessage id="notFound" defaultMessage="404 – Page not found" />
    </Typography>
  </Container>
);

NotFoundView.displayName = "NotFoundView";
