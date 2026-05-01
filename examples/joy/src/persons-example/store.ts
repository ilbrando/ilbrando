import { assertNever, sort } from "@ilbrando/utils";
import { createContext, Dispatch, Reducer } from "react";
import { Async, asyncFailed, asyncHasFinished, asyncIsRunning, asyncNotStarted } from "src/utils/async";

import { demoData } from "./demo-data";
import { Person } from "./types";

type SavePerson = {
  isAddingPerson: boolean;
  person: Person;
};
type SavePersonRequestAction = {
  type: "save-person-request";
  payload: SavePerson;
};

type SavePersonSuccessAction = {
  type: "save-person-success";
  payload: SavePerson;
};

type SavePersonFailedAction = {
  type: "save-person-failed";
  payload: string;
};

type ShowPersonDialog = {
  type: "show-person-dialog";
  payload?: Person["id"];
};

type HidePersonDialog = {
  type: "hide-person-dialog";
};

export type Actions = SavePersonRequestAction | SavePersonSuccessAction | SavePersonFailedAction | ShowPersonDialog | HidePersonDialog;

export type State = {
  persons: Person[];
  savePerson: Async<SavePerson, string>;
  personDialog: {
    dialogVisible: boolean;
    id?: Person["id"];
  };
};

export const createInitialState = (): State => ({
  persons: demoData,
  savePerson: asyncNotStarted,
  personDialog: { dialogVisible: false }
});

export const reducer: Reducer<State, Actions> = (prevState, action): State => {
  switch (action.type) {
    case "save-person-request":
      return { ...prevState, savePerson: asyncIsRunning };
    case "save-person-success": {
      const newPersons = action.payload.isAddingPerson ? [...prevState.persons, action.payload.person] : prevState.persons.map(x => (x.id === action.payload.person.id ? action.payload.person : x));
      return {
        ...prevState,
        savePerson: asyncHasFinished(action.payload),
        persons: sort(newPersons, "id")
      };
    }
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

export const PersonsContext = createContext<State | null>(null);
export const PersonsDispatchContext = createContext<Dispatch<Actions> | null>(null);
