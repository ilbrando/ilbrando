import { useReducer } from "react";

import { PersonsList } from "./persons-list";
import { createInitialState, PersonsContext, PersonsDispatchContext, reducer } from "./store";

export const Persons = () => {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  return (
    <PersonsContext.Provider value={state}>
      <PersonsDispatchContext.Provider value={dispatch}>
        <PersonsList />
      </PersonsDispatchContext.Provider>
    </PersonsContext.Provider>
  );
};
