import { renderHook } from "@testing-library/react";
import { describe, test } from "vitest";

import { useNumberValidationRules } from "./number";
import { assertValidationResult, genericErrorMessage } from "./validation-test-utils";

describe("number", () => {
  test.each`
    value | parameter | expected
    ${2}  | ${2}      | ${undefined}
    ${3}  | ${2}      | ${undefined}
    ${1}  | ${2}      | ${genericErrorMessage}
  `("min($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useNumberValidationRules());

    // Act
    const actual = result.current.min(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value | parameter | expected
    ${2}  | ${2}      | ${undefined}
    ${1}  | ${2}      | ${undefined}
    ${3}  | ${2}      | ${genericErrorMessage}
  `("max($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useNumberValidationRules());

    // Act
    const actual = result.current.max(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });

  test.each`
    value | parameter | expected
    ${2}  | ${2}      | ${undefined}
    ${4}  | ${2}      | ${undefined}
    ${3}  | ${2}      | ${genericErrorMessage}
  `("dividableBy($parameter)($value) => $expected", ({ value, parameter, expected }) => {
    // Arrange
    const { result } = renderHook(() => useNumberValidationRules());

    // Act
    const actual = result.current.dividableBy(parameter)(value);

    // Assert
    assertValidationResult(expected, actual);
  });
});
