import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getFormManager, useFormDefinition } from "@ilbrando/simple-form";
import { FormNumber, FormRangeSlider, FormText } from "@ilbrando/simple-form-joy";
import { ensureValue, hasValue, singleOrUndefined } from "@ilbrando/utils";
import { Alert, DialogContent, DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";
import { DialogActionsOkCancel, FormSubmitError, GroupBox } from "src/components";
import { fakeBackendRequest } from "src/utils";
import { usePersonValidators } from "./use-person-validators";
import { usePersonsStore } from "./use-persons-store";
export const PersonDialog = (props) => {
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
    const fd = useFormDefinition({
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
            const updatedPerson = {
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
            }
            else {
                dispatch({ type: "save-person-success", payload: { isAddingPerson, person: updatedPerson } });
                closeDialog();
            }
        }
    };
    return (_jsx(Modal, { open: true, children: _jsxs(ModalDialog, { minWidth: "lg", children: [_jsx(DialogTitle, { children: isAddingPerson ? "Add person" : `Edit person ${id}` }), _jsx(DialogContent, { children: _jsxs(Stack, { gap: 1, children: [_jsx(FormSubmitError, { errorMessage: submitError }), _jsx(Alert, { color: "warning", children: "Age = 99 is valid but will simulate an error from the backend." }), _jsx(GroupBox, { children: _jsxs(Stack, { alignItems: "flex-start", children: [isAddingPerson && _jsx(FormText, { formManager: fm, fieldName: "id", label: "ID" }), _jsx(FormText, { formManager: fm, fieldName: "name", label: "Name", fullWidth: true }), _jsx(FormNumber, { formManager: fm, fieldName: "age", label: "Age" }), _jsx(FormText, { formManager: fm, fieldName: "jobTitle", label: "Job title", fullWidth: true })] }) }), _jsx(GroupBox, { title: "Working hours", children: _jsx(FormRangeSlider, { formManager: fm, fieldName: "workingHours", min: 3, max: 23, marks: [...Array(23 - 3 + 1).keys()].map(x => ({ value: x + 3, label: (x + 3).toString() })) }) })] }) }), _jsx(DialogActionsOkCancel, { disabled: isSubmitting, submitDisabled: !isAddingPerson && !fm.hasModifiedValues, onSubmit: handleSubmit, onCancel: closeDialog })] }) }));
};
