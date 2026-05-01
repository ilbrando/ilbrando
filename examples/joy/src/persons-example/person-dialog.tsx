import { getFormManager, useFormDefinition } from "@ilbrando/simple-form";
import { FormNumber, FormRangeSlider, FormText } from "@ilbrando/simple-form-joy";
import { ensureValue, hasValue, singleOrUndefined } from "@ilbrando/utils";
import { Alert, DialogContent, DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";
import { DialogActionsOkCancel, FormSubmitError, GroupBox } from "src/components";
import { fakeBackendRequest } from "src/utils";

import { Person, PersonFormFields } from "./types";
import { usePersonValidators } from "./use-person-validators";
import { usePersonsStore } from "./use-persons-store";

type PersonDialogProps = {
  /** The ID of the person to edit. If undefined the dialog is used to add a new person. */
  id?: Person["id"];
};

export const PersonDialog = (props: PersonDialogProps) => {
  const { id } = props;

  const { state, dispatch } = usePersonsStore();

  const isSubmitting = state.savePerson.state === "is-running";
  const submitError = state.savePerson.state === "failed" ? state.savePerson.error : undefined;

  const person = singleOrUndefined(state.persons, x => x.id === id);

  const { validators, getJobTitleValidators } = usePersonValidators(person);

  const isAddingPerson = !hasValue(id);

  /**
    The PersonDialog is remounted each time a person is edited or added and then we get a new form definition
    with the correct initial state. If it weren't remounted, we could force a complete recreation
    of the state with: 
    
    `reCreateDependencies: [id]`
  */
  const fd = useFormDefinition<PersonFormFields>({
    fields: {
      id: {
        validators: validators.id,
        /** ID can't be changed, so this field is disabled if we are not adding a new person */
        initialIsDisabled: !isAddingPerson
      },
      name: {
        validators: validators.name,
        initialValue: person?.name
      },
      age: {
        validators: validators.age,
        initialValue: person?.age
      },
      jobTitle: {
        validators: validators.jobTitle,
        initialValue: person?.jobTitle
      },
      workingHours: {
        validators: validators.workingHours,
        initialValue: isAddingPerson
          ? {
              from: 8,
              to: 16
            }
          : hasValue(person?.workingHours)
            ? {
                from: person.workingHours.fromHour,
                to: person.workingHours.toHour
              }
            : undefined
      }
    }
  });

  const fm = getFormManager(fd, isSubmitting);

  fm.onChange.age = value => fm.setValidators("jobTitle", getJobTitleValidators(value));

  const closeDialog = () => {
    dispatch({ type: "hide-person-dialog" });
  };

  const handleSubmit = async () => {
    if (fm.validateForm()) {
      /**  the props on `fm.values` can always be null, but when validation is performed, we know which props are guarantied to have a value - ensureValue will throw if this assumption doesn't hold. */
      const updatedPerson: Person = {
        id: id ?? ensureValue(fm.values.id),
        name: ensureValue(fm.values.name),
        age: ensureValue(fm.values.age),
        jobTitle: ensureValue(fm.values.jobTitle),
        workingHours: hasValue(fm.values.workingHours) ? { fromHour: fm.values.workingHours.from, toHour: fm.values.workingHours.to } : undefined
      };
      dispatch({ type: "save-person-request", payload: { isAddingPerson, person: updatedPerson } });
      await fakeBackendRequest();
      if (updatedPerson.age === 99) {
        dispatch({ type: "save-person-failed", payload: "Sorry, we don't accept persons of age 99." });
      } else {
        dispatch({ type: "save-person-success", payload: { isAddingPerson, person: updatedPerson } });
        closeDialog();
      }
    }
  };

  return (
    <Modal open>
      <ModalDialog minWidth="lg">
        <DialogTitle>{isAddingPerson ? "Add person" : `Edit person ${id}`}</DialogTitle>
        <DialogContent>
          <Stack gap={1}>
            <FormSubmitError errorMessage={submitError} />
            <Alert color="warning">Age = 99 is valid but will simulate an error from the backend.</Alert>
            <GroupBox>
              <Stack alignItems="flex-start">
                {isAddingPerson && <FormText formManager={fm} fieldName="id" label="ID" />}
                <FormText formManager={fm} fieldName="name" label="Name" fullWidth />
                <FormNumber formManager={fm} fieldName="age" label="Age" />
                <FormText formManager={fm} fieldName="jobTitle" label="Job title" fullWidth />
              </Stack>
            </GroupBox>
            <GroupBox title="Working hours">
              <FormRangeSlider formManager={fm} fieldName="workingHours" marks={[...Array(23 - 3 + 1).keys()].map(x => ({ value: x + 3, label: (x + 3).toString() }))} max={23} min={3} />
            </GroupBox>
          </Stack>
        </DialogContent>
        {/* We set submitDiabled when no changes - only when editing. When adding the user should be allowed to click the button to reveal validation errors for all fields */}
        <DialogActionsOkCancel submitDisabled={!isAddingPerson && !fm.hasModifiedValues} disabled={isSubmitting} onCancel={closeDialog} onSubmit={handleSubmit} />
      </ModalDialog>
    </Modal>
  );
};
