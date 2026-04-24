import { jsx as _jsx } from "react/jsx-runtime";
import { hasValue } from "@ilbrando/utils";
import { Alert, Box } from "@mui/joy";
export const FormSubmitError = ({ errorMessage }) => {
    if (!hasValue(errorMessage))
        return null;
    return (_jsx(Box, { mb: 1, children: _jsx(Alert, { color: "danger", children: errorMessage }) }));
};
