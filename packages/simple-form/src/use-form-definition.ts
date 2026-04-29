import { singleOrUndefined } from "@ilbrando/utils";
import { SetStateAction, useEffect, useMemo, useState } from "react";

import { FormState, UseFormOptions, UseFormOptionsArray } from "./form-types";

const useFieldsNames = <TFields>(options: UseFormOptions<TFields>) => {
  const fieldNames = useMemo(() => {
    // we know these will never change because they are defined by the type TFields which can't change.
    const result: (keyof TFields)[] = [];
    for (const key in options.fields) {
      result.push(key);
    }
    return result;
  }, [options.fields]);

  return fieldNames;
};

const createInitialState = <TFields>(options: UseFormOptions<TFields>, fieldNames: ReturnType<typeof useFieldsNames<TFields>>) => {
  const result = {} as FormState<TFields>;

  fieldNames.forEach(fieldName => {
    const fieldOption = options.fields[fieldName];
    result[fieldName] = {
      value: fieldOption.initialValue ?? null,
      validators: fieldOption.validators ?? [],
      isTouched: false,
      isDisabled: fieldOption.initialIsDisabled ?? false
    };
  });
  return result as FormState<TFields>;
};

export const useFormDefinition = <TFields>(options: UseFormOptions<TFields>) => {
  const fieldNames = useFieldsNames(options);

  const [initialState, setInitialState] = useState(createInitialState(options, fieldNames));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setInitialState(createInitialState(options, fieldNames)), options.reCreateDependencies ?? []);

  const [formState, setFormState] = useState<FormState<TFields>>(initialState);

  useEffect(() => setFormState(initialState), [initialState]);

  return { formState, setFormState, fieldNames, initialState };
};

export const useFormDefinitionArray = <TFields>(options: UseFormOptionsArray<TFields>) => {
  const fieldNames = useFieldsNames(options);

  const createInitialStates = () =>
    Array.from(Array(options.itemsCount)).map((_, index) => {
      const override = singleOrUndefined(options.overrides ?? [], x => x.index === index);
      const fields = { ...options.fields, ...override?.fields };
      return createInitialState({ ...options, fields }, fieldNames);
    });

  const [initialStates, setInitialStates] = useState(createInitialStates());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setInitialStates(createInitialStates()), options.reCreateDependencies ?? []);

  const [formStates, setFormStates] = useState<FormState<TFields>[]>(initialStates);

  useEffect(() => setFormStates(initialStates), [initialStates]);

  return formStates.map((formState, index) => ({
    index,
    formState,
    setFormState: (newState: SetStateAction<FormState<TFields>>) =>
      setFormStates(prev =>
        prev.map((p, i) => {
          if (i !== index) return p;
          if (typeof newState === "function") {
            return newState(p);
          }
          return newState;
        })
      ),
    fieldNames,
    initialState: initialStates[index]
  }));
};
