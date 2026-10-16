import { hasValue } from "@ilbrando/utils";
import { useLocalization } from "src/localization";

import { Validator } from "../validation-types";

export const useNumberValidationRules = () => {
  const { texts } = useLocalization();

  return {
    min:
      (minValue: number, errorMessage?: string): Validator<number> =>
      value =>
        hasValue(value) && value < minValue ? (errorMessage ?? texts.min(minValue)) : undefined,

    max:
      (maxValue: number, errorMessage?: string): Validator<number> =>
      value =>
        hasValue(value) && value > maxValue ? (errorMessage ?? texts.max(maxValue)) : undefined,

    divisibleBy:
      (divisor: number, errorMessage?: string): Validator<number> =>
      value =>
        hasValue(value) && value % divisor !== 0 ? (errorMessage ?? texts.divisibleBy(divisor)) : undefined
  };
};
