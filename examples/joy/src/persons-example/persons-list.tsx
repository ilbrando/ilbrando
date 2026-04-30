import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Table } from "@mui/joy";

import { PersonDialog } from "./person-dialog";
import { usePersonsStore } from "./use-persons-store";

export const PersonsList = () => {
  const { state, dispatch } = usePersonsStore();

  return (
    <Box height="100%">
      <Button color="primary" startDecorator={<AddIcon />} onClick={() => dispatch({ type: "show-person-dialog" })}>
        Add person
      </Button>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Job title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {state.persons.map(person => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>{person.jobTitle}</td>
              <td>
                <IconButton color="primary" onClick={() => dispatch({ type: "show-person-dialog", payload: person.id })}>
                  <EditIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {state.personDialog.dialogVisible && <PersonDialog id={state.personDialog.id} />}
    </Box>
  );
};
