import { isUndefined } from "@ilbrando/utils";

import { FormFieldState, OnChangeEvents } from "./form-types";
import { useFormDefinition, useFormDefinitionArray } from "./use-form-definition";
import { getFieldValues, getHasErrors, getModifiedFieldValues, setFieldState, touchAllFieldsAndUpdateState, validateAllFieldsAndUpdateState } from "./utils";

export const getFormManager = <TFields>(formDefinition: ReturnType<typeof useFormDefinition<TFields>>, isSubmitting: boolean) => {
  const { formState, setFormState, fieldNames, initialState } = formDefinition;

  const onChange: OnChangeEvents<TFields> = {};

  const validateForm = () => {
    // this is not using setFormState(prev => ) because then we can't call it multiple times and get
    // the correct value of isValid out.
    const newState = fieldNames.reduce((acc, key) => ({ ...acc, [key]: { ...formState[key] } }), { ...formState });
    touchAllFieldsAndUpdateState(newState, fieldNames);
    validateAllFieldsAndUpdateState(newState, fieldNames);
    setFormState(newState);
    const isValid = !getHasErrors(newState, fieldNames);
    return isValid;
  };

  const setValue = <TFieldName extends keyof TFields, TFieldValue extends TFields[TFieldName]>(fieldName: TFieldName, value: TFieldValue | null, componentErrorMessage?: string) => {
    setFormState(prev => {
      const newState = setFieldState(prev, fieldName, { value, componentErrorMessage, isTouched: true });
      validateAllFieldsAndUpdateState(newState, fieldNames);
      return newState;
    });
    onChange[fieldName]?.(value);
  };

  const getValidators = <TFieldName extends keyof TFields>(fieldName: TFieldName) => formState[fieldName].validators;

  const setValidators = <TFieldName extends keyof TFields, TFieldValue extends TFields[TFieldName]>(fieldName: TFieldName, validators: FormFieldState<TFieldValue>["validators"]) => {
    setFormState(prev => {
      const newState = setFieldState(prev, fieldName, { validators });
      validateAllFieldsAndUpdateState(newState, fieldNames);
      return newState;
    });
  };

  const getIsTouched = <TFieldName extends keyof TFields>(fieldName: TFieldName) => formState[fieldName].isTouched;

  const setIsTouched = <TFieldName extends keyof TFields>(fieldName: TFieldName, isTouched: boolean) => {
    setFormState(prev => {
      const newState = setFieldState(prev, fieldName, { isTouched });
      validateAllFieldsAndUpdateState(newState, fieldNames);
      return newState;
    });
  };

  const getIsDisabled = <TFieldName extends keyof TFields>(fieldName: TFieldName) => formState[fieldName].isDisabled;

  const setIsDisabled = <TFieldName extends keyof TFields>(fieldName: TFieldName, isDisabled: boolean) => {
    setFormState(prev => {
      const newState = setFieldState(prev, fieldName, { isDisabled });
      validateAllFieldsAndUpdateState(newState, fieldNames);
      return newState;
    });
  };

  const initialValues = getFieldValues(initialState, fieldNames);
  const values = getFieldValues(formState, fieldNames);
  const modifiedValues = getModifiedFieldValues(initialValues, values);
  const hasModifiedValues = Object.entries(modifiedValues).length > 0;

  const getIsFieldModified = <TFieldName extends keyof TFields>(fieldName: TFieldName) => !isUndefined(modifiedValues[fieldName]);

  return {
    /** This is the `formState` from the form definition you called this hook with. It is included in the result so the
     * form manager can be passed on to field controls and they have access to the form state.
     */
    formState,
    /** This is the `isSubmitting` parameter you called this hook with. It is included in the result so the
     * form manager can be passed on to field controls and they have access to the submitting state.
     */
    isSubmitting,
    /** An object with values for all fields that are not disabled. If validation for a field isn't successful the value is `null`.
     */
    values,
    /** An object with values for the fields that have changed (compared with initial values). */
    modifiedValues,
    /** Is `true` if `modifiedValues` contains any fields/values. */
    hasModifiedValues,
    /** Returns true if the fields is modified (compared with initial value).
     */
    getIsFieldModified,
    /** Validates all fields and returns `true` if all validations succeeded.
     *
     * You will normally call this function in a submit handler and only proceed if the result is `true`.
     */
    validateForm,
    getValidators,
    /** Use this to set the validators for a field. This also validates all fields. */
    setValidators,
    /** Use this to set the value for a field. */
    setValue,
    getIsTouched,
    /** You normally don't use this your self. It is used by field controls to set the `isTouched` value for
     * fields.
     */
    setIsTouched,
    getIsDisabled,
    /** Use this to disable a field. A disabled field is excluded from validation and is not
     * present in `values`.
     */
    setIsDisabled,
    /** You can set a handler for each field and receive notifications, when the field value is changed. */
    onChange
  };
};

export const getFormManagerArray = <TFields>(formDefinition: ReturnType<typeof useFormDefinitionArray<TFields>>, isSubmitting: boolean) => {
  return formDefinition.map(fd => getFormManager(fd, isSubmitting));
};

export type FormManager<TFields> = ReturnType<typeof getFormManager<TFields>>;
