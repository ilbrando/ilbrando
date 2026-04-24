import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Box, CssBaseline, extendTheme, ThemeProvider } from "@mui/joy";
import { Persons } from "./persons-example/persons";
const theme = extendTheme({
    simpleForm: {
        reserveSpaceForValidationMessage: true
    }
});
ReactDOM.createRoot(document.getElementById("root")).render(_jsxs(StrictMode, { children: [_jsx(CssBaseline, {}), _jsx(ThemeProvider, { theme: theme, children: _jsx(Box, { height: "100%", maxWidth: "1024px", p: 4, children: _jsx(Persons, {}) }) })] }));
