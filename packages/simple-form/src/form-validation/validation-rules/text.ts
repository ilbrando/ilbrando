import { hasValue } from "@ilbrando/utils";
import { useLocalization } from "src/localization";

import { Validator } from "../validation-types";

export const useTextValidationRules = () => {
  const { texts } = useLocalization();

  return {
    minLength:
      (minValue: number, errorMessage?: string): Validator<string> =>
      value =>
        typeof value === "string" && hasValue(value) && value.trimEnd().length < minValue ? (errorMessage ?? texts.minLength(minValue)) : undefined,

    maxLength:
      (maxValue: number, errorMessage?: string): Validator<string> =>
      value =>
        typeof value === "string" && hasValue(value) && value.trimEnd().length > maxValue ? (errorMessage ?? texts.maxLength(maxValue)) : undefined,

    length:
      (stringLength: number, errorMessage?: string): Validator<string> =>
      value =>
        typeof value === "string" && hasValue(value) && value.trimEnd().length !== stringLength ? (errorMessage ?? texts.length(stringLength)) : undefined
  };
};
