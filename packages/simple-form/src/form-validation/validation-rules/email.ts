import { hasValue } from "@ilbrando/utils";

import { useLocalization } from "src/localization";

import { Validator } from "../validation-types";

const mailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useEmailValidationRules = () => {
  const { texts } = useLocalization();

  return {
    email:
      (errorMessage?: string): Validator<string> =>
      value =>
        hasValue(value) && !mailRegEx.test(value) ? (errorMessage ?? texts.email) : undefined
  };
};
