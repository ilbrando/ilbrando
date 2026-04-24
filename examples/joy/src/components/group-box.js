import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Stack, Typography } from "@mui/joy";
export const GroupBox = (props) => {
    const { title, footer, children, fullHeight = false } = props;
    return (_jsx(Box, { bgcolor: t => t.palette.neutral["100"], p: 1, height: fullHeight ? 1 : undefined, borderRadius: theme => `${theme.radius}px`, children: _jsxs(Stack, { gap: 0, children: [title && _jsx(Typography, { level: "title-md", children: title }), _jsx(Stack, { children: children }), footer && (_jsx(Typography, { fontStyle: "italic", textColor: "info.main", children: footer }))] }) }));
};
