import { useContext } from "react";
import { ensureValue } from "@ilbrando/utils";
import { PersonsContext, PersonsDispatchContext } from "./store";
export const usePersonsStore = () => {
    const state = ensureValue(useContext(PersonsContext), "PersonsList must be used in a PersonsContext.Provider");
    const dispatch = ensureValue(useContext(PersonsDispatchContext), "PersonsList must be used in a PersonsDispatchContext.Provider");
    return { state, dispatch };
};
