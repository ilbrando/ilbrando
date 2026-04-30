import { ensureValue } from "@ilbrando/utils";
import { Box, CssBaseline, extendTheme, ThemeProvider } from "@mui/joy";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { Persons } from "./persons-example/persons";

declare module "@mui/joy/styles" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Theme {
    simpleForm?: {
      reserveSpaceForValidationMessage?: boolean;
    };
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CssVarsThemeOptions {
    simpleForm?: {
      reserveSpaceForValidationMessage?: boolean;
    };
  }
}

const theme = extendTheme({
  simpleForm: {
    reserveSpaceForValidationMessage: true
  }
});

ReactDOM.createRoot(ensureValue(document.getElementById("root"))).render(
  <StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <Box height="100%" maxWidth="1024px" p={4}>
        <Persons />
      </Box>
    </ThemeProvider>
  </StrictMode>
);
