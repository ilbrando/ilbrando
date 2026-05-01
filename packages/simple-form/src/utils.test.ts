import { deepMerge, DeepPartial } from "@ilbrando/utils";
import { beforeAll, describe, expect, test } from "vitest";

import { FormState } from "./form-types";
import { getFieldValues, getHasErrors, touchAllFieldsAndUpdateState } from "./utils";

type FormFields = {
  stringField: string;
  numberField: number;
};

type TestData = DeepPartial<FormState<FormFields>>;

describe("utils", () => {
  let formState: FormState<FormFields>;

  beforeAll(() => {
    formState = {
      stringField: {
        value: "foo",
        isDisabled: false,
        isTouched: false,
        validators: []
      },
      numberField: {
        value: 42,
        isDisabled: false,
        isTouched: false,
        validators: []
      }
    };
  });

  describe("getHasErrors", () => {
    const scenarioStringFieldError: TestData = { stringField: { errorMessage: "foo" } };
    const scenarioNumberFieldError: TestData = { numberField: { errorMessage: "foo" } };
    const scenarioAllFieldsError: TestData = { stringField: { errorMessage: "foo" }, numberField: { errorMessage: "foo" } };
    const scenarioAllFieldsErrorAllDisabled: TestData = { stringField: { errorMessage: "foo", isDisabled: true }, numberField: { errorMessage: "foo", isDisabled: true } };

    test.each`
      data                                 | expected | description
      ${{}}                                | ${false} | ${"No errors"}
      ${scenarioStringFieldError}          | ${true}  | ${"Error in stringField"}
      ${scenarioNumberFieldError}          | ${true}  | ${"Error in numberField"}
      ${scenarioAllFieldsError}            | ${true}  | ${"Error in all fields"}
      ${scenarioAllFieldsErrorAllDisabled} | ${false} | ${"Error in all fields, but they are all disabled"}
    `("getHasErrors: $description => $expected", ({ data, expected }: { data: TestData; expected: boolean }) => {
      // Arrange
      const effectiveFormState = deepMerge(formState, data);

      // Act
      const actual = getHasErrors(effectiveFormState, ["stringField", "numberField"]);

      // Assert
      expect(actual).toBe(expected);
    });
  });

  describe("getFieldValues", () => {
    const expected: ReturnType<typeof getFieldValues<FormFields>> = {
      stringField: "foo",
      numberField: 42
    };

    const scenarioNumberFieldDisabled: TestData = { numberField: { isDisabled: true } };
    const scenarioNumberFieldDisabledExpected: ReturnType<typeof getFieldValues<FormFields>> = {
      stringField: "foo"
    };

    test.each`
      data                           | expected                               | description
      ${{}}                          | ${expected}                            | ${"All fields enabled"}
      ${scenarioNumberFieldDisabled} | ${scenarioNumberFieldDisabledExpected} | ${"Number field is disabled"}
    `("getFieldValues: $description => $expected", ({ data, expected }: { data: TestData; expected: boolean }) => {
      // Arrange
      const effectiveFormState = deepMerge(formState, data);

      // Act
      const actual = getFieldValues(effectiveFormState, ["stringField", "numberField"]);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe("touchAllFieldsAndUpdateState", () => {
    test("it sets all fields to touched", () => {
      // Act
      touchAllFieldsAndUpdateState(formState, ["stringField", "numberField"]);

      // Assert
      expect(formState.stringField.isTouched).toBeTruthy();
      expect(formState.numberField.isTouched).toBeTruthy();
    });
  });
});
