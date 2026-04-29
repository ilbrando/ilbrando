import { Box, CssBaseline, extendTheme, ThemeProvider } from "@mui/joy";
import { ReactNode } from "react";

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

export const TestWrapper = (props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Box height="100%" maxWidth="1024px" p={4}>
          {children}
        </Box>
      </ThemeProvider>
    </>
  );
};
