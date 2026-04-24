import { jsx as _jsx } from "react/jsx-runtime";
import { hasValue } from "@ilbrando/utils";
import { Button } from "@mui/joy";
import CancelIcon from "@mui/icons-material/Cancel";
export const OkButton = ({ children, ...rest }) => {
    return (_jsx(Button, { color: "primary", ...rest, children: hasValue(children) ? children : "OK" }));
};
export const CancelButton = ({ children, ...rest }) => {
    return (_jsx(Button, { variant: "soft", startDecorator: _jsx(CancelIcon, {}), ...rest, children: hasValue(children) ? children : "Cancel" }));
};
