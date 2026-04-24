import { jsx as _jsx } from "react/jsx-runtime";
import { useReducer } from "react";
import { PersonsList } from "./persons-list";
import { createInitialState, PersonsContext, PersonsDispatchContext, reducer } from "./store";
export const Persons = () => {
    const [state, dispatch] = useReducer(reducer, null, createInitialState);
    return (_jsx(PersonsContext.Provider, { value: state, children: _jsx(PersonsDispatchContext.Provider, { value: dispatch, children: _jsx(PersonsList, {}) }) }));
};
