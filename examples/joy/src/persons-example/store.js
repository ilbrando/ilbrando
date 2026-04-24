import { createContext } from "react";
import { assertNever, sort } from "@ilbrando/utils";
import { asyncFailed, asyncHasFinished, asyncIsRunning, asyncNotStarted } from "src/utils/async";
import { demoData } from "./demo-data";
export const createInitialState = () => ({
    persons: demoData,
    savePerson: asyncNotStarted,
    personDialog: { dialogVisible: false }
});
export const reducer = (prevState, action) => {
    switch (action.type) {
        case "save-person-request":
            return { ...prevState, savePerson: asyncIsRunning };
        case "save-person-success":
            const newPersons = action.payload.isAddingPerson ? [...prevState.persons, action.payload.person] : prevState.persons.map(x => (x.id === action.payload.person.id ? action.payload.person : x));
            return {
                ...prevState,
                savePerson: asyncHasFinished(action.payload),
                persons: sort(newPersons, "id")
            };
        case "save-person-failed":
            return { ...prevState, savePerson: asyncFailed(action.payload) };
        case "show-person-dialog":
            return { ...prevState, personDialog: { dialogVisible: true, id: action.payload }, savePerson: asyncNotStarted };
        case "hide-person-dialog":
            return { ...prevState, personDialog: { dialogVisible: false } };
        default:
            assertNever(action);
    }
};
export const PersonsContext = createContext(null);
export const PersonsDispatchContext = createContext(null);
