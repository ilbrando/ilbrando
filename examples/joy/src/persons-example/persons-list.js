import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, IconButton, Table } from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { PersonDialog } from "./person-dialog";
import { usePersonsStore } from "./use-persons-store";
export const PersonsList = () => {
    const { state, dispatch } = usePersonsStore();
    return (_jsxs(Box, { height: "100%", children: [_jsx(Button, { color: "primary", startDecorator: _jsx(AddIcon, {}), onClick: () => dispatch({ type: "show-person-dialog" }), children: "Add person" }), _jsxs(Table, { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Name" }), _jsx("th", { children: "Age" }), _jsx("th", { children: "Job title" }), _jsx("th", {})] }) }), _jsx("tbody", { children: state.persons.map(person => (_jsxs("tr", { children: [_jsx("td", { children: person.id }), _jsx("td", { children: person.name }), _jsx("td", { children: person.age }), _jsx("td", { children: person.jobTitle }), _jsx("td", { children: _jsx(IconButton, { color: "primary", onClick: () => dispatch({ type: "show-person-dialog", payload: person.id }), children: _jsx(EditIcon, {}) }) })] }, person.id))) })] }), state.personDialog.dialogVisible && _jsx(PersonDialog, { id: state.personDialog.id })] }));
};
