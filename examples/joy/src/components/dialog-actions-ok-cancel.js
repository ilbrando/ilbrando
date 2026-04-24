import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, DialogActions } from "@mui/joy";
import { CancelButton, OkButton } from "./buttons";
export const DialogActionsOkCancel = (props) => {
    const { disabled, submitDisabled = false, onSubmit, onCancel } = props;
    return (_jsx(DialogActions, { children: _jsxs(Box, { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, children: [_jsx(OkButton, { disabled: disabled || submitDisabled, onClick: onSubmit }), _jsx(CancelButton, { disabled: disabled, onClick: onCancel })] }) }));
};
