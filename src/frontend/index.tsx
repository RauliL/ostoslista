import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider } from "@mui/material/styles";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { getBrowserLanguage, translations } from "./i18n";
import { theme } from "./theme";

const container = document.getElementById("root");
const root = createRoot(container!);
const language = getBrowserLanguage();

root.render(
  <StrictMode>
    <InitColorSchemeScript defaultMode="system" />
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <IntlProvider locale={language} messages={translations[language]}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </IntlProvider>
    </ThemeProvider>
  </StrictMode>,
);
