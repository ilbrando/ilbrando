import { ensureValue, hasValue } from "@ilbrando/utils";
import { expect } from "vitest";

export const genericErrorMessage = "##ERROR##";

export const assertValidationResult = (expected: string | undefined, actual: string | undefined) => {
  if (hasValue(expected)) {
    if (expected === genericErrorMessage) {
      expect(actual).not.toBeUndefined();
      expect(ensureValue(actual).length).toBeGreaterThan(1);
    } else {
      expect(actual).toBe(expected);
    }
  } else {
    expect(actual).toBeUndefined();
  }
};
