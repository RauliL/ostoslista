import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider } from "@mui/material/styles";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";

import { App } from "./components";
import { getBrowserLanguage, translations } from "./i18n";
import { theme } from "./theme";

const container = document.getElementById("root");
const root = createRoot(container!);
const language = getBrowserLanguage();

root.render(
  <StrictMode>
    <InitColorSchemeScript />
    <ThemeProvider theme={theme}>
      <IntlProvider locale={language} messages={translations[language]}>
        <App />
      </IntlProvider>
    </ThemeProvider>
  </StrictMode>,
);
