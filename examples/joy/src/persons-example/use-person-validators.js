import { useValidationRules } from "@ilbrando/simple-form";
import { hasValue } from "@ilbrando/utils";
/**
 * You can apply the validators in the `useFormDefinition` call, but if you want to
 * share them between forms, you can create your own hook like this.
 */
export const usePersonValidators = (initial) => {
    const { required, maxLength, min, max, alwaysValid } = useValidationRules();
    /** The `alwaysValid` validator can make it easier to construct conditional arrays of validators */
    const getJobTitleValidators = (age) => [hasValue(age) && age >= 18 ? required() : alwaysValid, maxLength(50)];
    const validators = {
        id: [required(), maxLength(20)],
        name: [required(), maxLength(50)],
        age: [required(), min(3, "No toddlers"), max(125, "Really! That old?")],
        jobTitle: getJobTitleValidators(initial?.age ?? null),
        workingHours: []
    };
    return { validators, getJobTitleValidators };
};
